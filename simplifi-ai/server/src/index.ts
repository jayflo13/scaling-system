import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import Stripe from 'stripe';
import { query } from './db';
import { syncUserCalendar } from './sync';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16' as any,
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';

const app = express();
app.use(cors());

// Stripe webhook needs raw body
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // In production, we'd verify the signature. 
    // For development/mock tests, we can skip if the secret is 'whsec_mock'
    if (process.env.NODE_ENV === 'test' || endpointSecret === 'whsec_mock') {
      event = JSON.parse(req.body.toString());
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.client_reference_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId) {
          await query(`UPDATE app_users SET 
            plan = 'premium', 
            stripe_customer_id = '${customerId}', 
            stripe_subscription_id = '${subscriptionId}' 
            WHERE id = '${userId}'`);
          console.log(`User ${userId} upgraded to Premium via Stripe Webhook`);
        }
        break;
      case 'customer.subscription.deleted':
        const deletedSub = event.data.object;
        await query(`UPDATE app_users SET plan = 'free' WHERE stripe_subscription_id = '${deletedSub.id}'`);
        console.log(`Subscription ${deletedSub.id} deleted, user downgraded to Free`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return res.status(500).send('Internal Server Error');
  }

  res.json({ received: true });
});

app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback'
);

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.freebusy',
  'openid',
  'email',
  'profile'
];

// 1. Auth URL
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.redirect(url);
});

// 2. Callback
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const { id, email, name } = userInfo.data;

    // Save user and tokens to database
    await query(`INSERT INTO app_users (id, email, name) VALUES ('${id}', '${email}', '${name}') ON CONFLICT(id) DO UPDATE SET email='${email}', name='${name}'`);
    
    await query(`INSERT INTO app_google_auth (user_id, access_token, refresh_token, expiry_date) 
      VALUES ('${id}', '${tokens.access_token}', '${tokens.refresh_token}', ${tokens.expiry_date}) 
      ON CONFLICT(user_id) DO UPDATE SET access_token='${tokens.access_token}', refresh_token='${tokens.refresh_token}', expiry_date=${tokens.expiry_date}`);

    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Error during Google callback:', error);
    res.status(500).send('Authentication failed');
  }
});

// 3. User Preferences
app.get('/api/user/:id/preferences', async (req, res) => {
  const { id } = req.params;
  try {
    const users = await query(`SELECT * FROM app_users WHERE id = '${id}'`);
    if (users.length === 0) return res.status(404).send('User not found');
    res.json(users[0]);
  } catch (error) {
    res.status(500).send('Error fetching preferences');
  }
});

app.post('/api/user/:id/preferences', async (req, res) => {
  const { id } = req.params;
  const { focus_hours, family_time, buffer_time } = req.body;
  try {
    await query(`UPDATE app_users SET focus_hours = '${JSON.stringify(focus_hours)}', family_time = '${JSON.stringify(family_time)}', buffer_time = ${buffer_time} WHERE id = '${id}'`);
    res.send('Preferences updated');
  } catch (error) {
    res.status(500).send('Error updating preferences');
  }
});

// 4. Manual Sync & Tasks
app.post('/api/user/:id/sync', async (req, res) => {
  const { id } = req.params;
  try {
    // Run in background
    runSyncJob(id, 'calendar_sync', syncUserCalendar);
    res.send('Sync started');
  } catch (error) {
    res.status(500).send('Sync failed');
  }
});

app.get('/api/user/:id/sync-status', async (req, res) => {
  const { id } = req.params;
  try {
    const jobs = await query(`SELECT * FROM background_jobs WHERE user_id = '${id}' ORDER BY updated_at DESC`);
    res.json(jobs);
  } catch (error) {
    res.status(500).send('Error fetching sync status');
  }
});

app.post('/api/jobs/:id/retry', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await query(`SELECT * FROM background_jobs WHERE id = '${id}'`);
    if (job.length === 0) return res.status(404).send('Job not found');
    
    // For MVP, just trigger it immediately
    runSyncJob(job[0].user_id, job[0].job_type, syncUserCalendar);
    res.send('Retry started');
  } catch (error) {
    res.status(500).send('Error retrying job');
  }
});

app.get('/api/user/:id/tasks', async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await query(`SELECT * FROM app_flexible_tasks WHERE user_id = '${id}' ORDER BY deadline DESC`);
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error fetching tasks');
  }
});

// Helper for background jobs
async function runSyncJob(userId: string, jobType: string, syncFn: (id: string) => Promise<void>) {
  const jobId = `${userId}-${jobType}`;
  try {
    await query(`
      INSERT INTO background_jobs (id, user_id, job_type, status, updated_at)
      VALUES ('${jobId}', '${userId}', '${jobType}', 'processing', CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET status='processing', updated_at=CURRENT_TIMESTAMP
    `);
    await syncFn(userId);
    await query(`UPDATE background_jobs SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = '${jobId}'`);
  } catch (error: any) {
    console.error(`Job ${jobId} failed:`, error);
    await query(`UPDATE background_jobs SET status = 'failed', last_error = '${error.message.replace(/'/g, "''")}', updated_at = CURRENT_TIMESTAMP WHERE id = '${jobId}'`);
  }
}

// 5. Background Sync Cron (Every 30 minutes)
cron.schedule('*/30 * * * *', async () => {
  console.log('Running background sync for all users...');
  try {
    const users = await query('SELECT id FROM app_users');
    for (const user of users) {
      runSyncJob(user.id, 'calendar_sync', syncUserCalendar);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
