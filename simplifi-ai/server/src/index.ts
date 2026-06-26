import express from 'express';
import { google } from 'googleapis';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { query } from './db';
import { syncUserCalendar } from './sync';

dotenv.config();

const app = express();
app.use(cors());
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
    await syncUserCalendar(id);
    res.send('Sync started');
  } catch (error) {
    res.status(500).send('Sync failed');
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

// 5. Background Sync Cron (Every 30 minutes)
cron.schedule('*/30 * * * *', async () => {
  console.log('Running background sync for all users...');
  try {
    const users = await query('SELECT id FROM app_users');
    for (const user of users) {
      await syncUserCalendar(user.id);
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
