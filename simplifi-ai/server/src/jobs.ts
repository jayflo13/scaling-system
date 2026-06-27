import { query } from './db';
import { syncUserCalendar } from './sync';
import { predictGroceryNeeds, addToKrogerCart } from './integrations';
import logger from './logger';

export async function enqueueJob(userId: string, jobType: string, nextRunAt?: Date) {
  const id = Math.random().toString(36).substring(2, 15);
  const runAt = nextRunAt ? nextRunAt.toISOString() : new Date().toISOString();
  
  await query(`INSERT INTO background_jobs (id, user_id, job_type, next_run_at) 
    VALUES ('${id}', '${userId}', '${jobType}', '${runAt}')`);
  
  logger.info(`Enqueued job ${jobType} for user ${userId} at ${runAt}`);
}

export async function processJobs() {
  const now = new Date().toISOString();
  
  // Find jobs that are pending and ready to run
  const jobs = await query(`SELECT * FROM background_jobs 
    WHERE status = 'pending' AND next_run_at <= '${now}' 
    LIMIT 10`);

  if (jobs.length === 0) return;

  for (const job of jobs) {
    try {
      // Mark as processing
      await query(`UPDATE background_jobs SET status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = '${job.id}'`);
      
      logger.info(`Processing job ${job.job_type} (${job.id}) for user ${job.user_id}`);

      if (job.job_type === 'calendar_sync') {
        await syncUserCalendar(job.user_id);
      } else if (job.job_type === 'grocery_sync') {
        await handleGrocerySync(job.user_id);
      }

      // Mark as completed
      await query(`UPDATE background_jobs SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = '${job.id}'`);
    } catch (error: any) {
      const attempts = (job.attempts || 0) + 1;
      const status = attempts >= 3 ? 'failed' : 'pending';
      const nextRun = new Date(Date.now() + Math.pow(2, attempts) * 60000).toISOString(); // Exponential backoff
      
      logger.error(`Job ${job.id} failed (attempt ${attempts}):`, error);
      
      await query(`UPDATE background_jobs SET 
        status = '${status}', 
        attempts = ${attempts}, 
        last_error = '${error.message.replace(/'/g, "''")}', 
        next_run_at = '${nextRun}',
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = '${job.id}'`);
    }
  }
}

async function handleGrocerySync(userId: string) {
  // Logic for automatic grocery restock sync
  const suggestions = await predictGroceryNeeds(userId);
  
  // Get household_id if any
  const householdResults = await query(`SELECT household_id FROM household_members WHERE user_id = '${userId}'`);
  const householdId = householdResults.length > 0 ? householdResults[0].household_id : undefined;

  for (const suggestion of suggestions) {
    try {
      await addToKrogerCart(userId, suggestion.upc, suggestion.quantity, householdId);
      
      // Log telemetry event for background added item
      const telemetryId = Math.random().toString(36).substring(2, 15);
      await query(`INSERT INTO telemetry_events (id, user_id, household_id, event_type, event_data) 
        VALUES ('${telemetryId}', '${userId}', '${householdId || ''}', 'grocery_item_auto_added', '${JSON.stringify({ upc: suggestion.upc, reason: suggestion.reason, minutes_saved: 1, source: 'background_sync' })}')`);
    } catch (err) {
      logger.warn(`Grocery sync item fail for user ${userId}:`, err);
    }
  }
}

export async function schedulerHeartbeat() {
  // Enqueue periodic syncs for all users who haven't had one recently
  const users = await query('SELECT id FROM app_users');
  const now = new Date();
  
  for (const user of users) {
    // Check if a calendar sync is already pending or was recently completed
    const existing = await query(`SELECT id FROM background_jobs 
      WHERE user_id = '${user.id}' AND job_type = 'calendar_sync' 
      AND (status = 'pending' OR (status = 'completed' AND created_at > date('now', '-30 minutes')))`);
    
    if (existing.length === 0) {
      await enqueueJob(user.id, 'calendar_sync');
    }

    // Grocery sync every 24 hours
    const existingGrocery = await query(`SELECT id FROM background_jobs 
      WHERE user_id = '${user.id}' AND job_type = 'grocery_sync' 
      AND (status = 'pending' OR (status = 'completed' AND created_at > date('now', '-1 day')))`);
    
    if (existingGrocery.length === 0) {
      await enqueueJob(user.id, 'grocery_sync');
    }
  }
}
