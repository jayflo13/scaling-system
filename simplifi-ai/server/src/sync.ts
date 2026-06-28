import { google } from 'googleapis';
import { query } from './db';
import { classifyEvent } from './ai';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function getAuthenticatedClient(userId: string) {
  const authData = await query(`SELECT * FROM app_google_auth WHERE user_id = '${userId}'`);
  if (authData.length === 0) return null;

  const { access_token, refresh_token, expiry_date } = authData[0];
  oauth2Client.setCredentials({
    access_token,
    refresh_token,
    expiry_date: Number(expiry_date)
  });

  if (Date.now() >= Number(expiry_date)) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await query(`UPDATE app_google_auth SET 
        access_token = '${credentials.access_token}', 
        expiry_date = ${credentials.expiry_date} 
        WHERE user_id = '${userId}'`);
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error(`Error refreshing token for user ${userId}:`, error);
      return null;
    }
  }

  return oauth2Client;
}

export async function syncUserCalendar(userId: string) {
  const auth = await getAuthenticatedClient(userId);
  if (!auth) return;

  const calendar = google.calendar({ version: 'v3', auth });
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: nextWeek.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const userPrefs = await query(`SELECT * FROM app_users WHERE id = '${userId}'`);
    const prefs = userPrefs[0] || {};

    // 4. FEEDBACK LOOP: Check for deleted or moved automated events
    await checkAutomatedEventsFeedback(userId, events);

    for (const event of events) {
      await processEventForAutomations(userId, event, events, prefs);
    }
  } catch (error) {
    console.error(`Error syncing calendar for user ${userId}:`, error);
  }
}

async function checkAutomatedEventsFeedback(userId: string, currentEvents: any[]) {
  const ourTasks = await query(`SELECT * FROM app_flexible_tasks WHERE user_id = '${userId}' AND status = 'completed'`);
  
  for (const task of ourTasks) {
    const calendarEvent = currentEvents.find(e => e.summary === task.title);
    
    if (!calendarEvent) {
      // Event was deleted
      const telemetryId = Math.random().toString(36).substring(2, 15);
      await query(`INSERT INTO telemetry_events (id, user_id, event_type, event_data) 
        VALUES ('${telemetryId}', '${userId}', 'automated_event_deleted', '${JSON.stringify({ title: task.title }).replace(/'/g, "''")}')`);
      await query(`UPDATE app_flexible_tasks SET status = 'deleted' WHERE id = '${task.id}'`);
      console.log(`Detected deletion of automated event: ${task.title} for user ${userId}`);
    } else {
      const calendarStart = new Date(calendarEvent.start.dateTime || calendarEvent.start.date).toISOString();
      if (calendarStart !== task.deadline) {
        // Event was moved
        const telemetryId = Math.random().toString(36).substring(2, 15);
        await query(`INSERT INTO telemetry_events (id, user_id, event_type, event_data) 
          VALUES ('${telemetryId}', '${userId}', 'automated_event_moved', '${JSON.stringify({ title: task.title, old_start: task.deadline, new_start: calendarStart }).replace(/'/g, "''")}')`);
        await query(`UPDATE app_flexible_tasks SET deadline = '${calendarStart}' WHERE id = '${task.id}'`);
        console.log(`Detected move of automated event: ${task.title} for user ${userId} to ${calendarStart}`);
      }
    }
  }
}

export async function processEventForAutomations(userId: string, event: any, allEvents: any[], prefs: any) {
  const summary = event.summary || '';
  const description = event.description || '';
  
  if (summary.toLowerCase().startsWith('📅 [simplifi]')) return;

  // 1. Gemini-powered event classification with confidence score
  const classification = await classifyEvent(summary, description);
  
  // 2. Telemetry for AI suggestion
  const telemetryId = Math.random().toString(36).substring(2, 15);
  await query(`INSERT INTO telemetry_events (id, user_id, event_type, event_data) 
    VALUES ('${telemetryId}', '${userId}', 'intelligent_action_suggested', '${JSON.stringify({ summary, classification }).replace(/'/g, "''")}')`);

  // 3. Handle Preparation Tasks
  if (classification.prep_task && classification.prep_duration_minutes > 0) {
    await handlePrepTaskAutomation(userId, event, classification, allEvents, prefs);
  }

  // 4. Handle Buffers
  if (classification.buffer_before_minutes > 0 || classification.buffer_after_minutes > 0) {
    await handleBufferAutomation(userId, event, classification, allEvents, prefs);
  }
}

async function handlePrepTaskAutomation(userId: string, event: any, classification: any, allEvents: any[], prefs: any) {
  const eventStart = new Date(event.start.dateTime || event.start.date);
  const title = `📅 [Simplifi] Prep: ${classification.prep_task}`;
  
  const existing = await query(`SELECT * FROM app_flexible_tasks WHERE user_id = '${userId}' AND title = '${title.replace(/'/g, "''")}'`);
  if (existing.length > 0) return;

  const duration = classification.prep_duration_minutes;
  
  // ROBUST SCHEDULING: 3-day rolling window
  let slot = null;
  for (let dayOffset = 0; dayOffset <= 2; dayOffset++) {
    const searchEnd = new Date(eventStart.getTime() - 30 * 60000 - (dayOffset * 24 * 60 * 60 * 1000));
    const searchStart = new Date(searchEnd.getTime() - 24 * 60 * 60 * 1000);
    
    slot = findGap(searchStart, searchEnd, duration, allEvents, prefs);
    if (slot) break;
  }

  if (slot) {
    await createAutomatedEvent(userId, title, slot, duration, classification.confidence_score);
  }
}

async function handleBufferAutomation(userId: string, event: any, classification: any, allEvents: any[], prefs: any) {
  const startTime = new Date(event.start.dateTime || event.start.date);
  const endTime = new Date(event.end.dateTime || event.end.date);
  
  if (classification.buffer_before_minutes > 0) {
    const title = `📅 [Simplifi] ${classification.category} Buffer (Before)`;
    const existing = await query(`SELECT * FROM app_flexible_tasks WHERE user_id = '${userId}' AND title = '${title.replace(/'/g, "''")}'`);
    if (existing.length === 0) {
      const bufferStart = new Date(startTime.getTime() - classification.buffer_before_minutes * 60000);
      await createAutomatedEvent(userId, title, bufferStart, classification.buffer_before_minutes, classification.confidence_score);
    }
  }

  if (classification.buffer_after_minutes > 0) {
    const title = `📅 [Simplifi] ${classification.category} Buffer (After)`;
    const existing = await query(`SELECT * FROM app_flexible_tasks WHERE user_id = '${userId}' AND title = '${title.replace(/'/g, "''")}'`);
    if (existing.length === 0) {
      const bufferStart = new Date(endTime);
      await createAutomatedEvent(userId, title, bufferStart, classification.buffer_after_minutes, classification.confidence_score);
    }
  }
}

function findGap(start: Date, end: Date, durationMinutes: number, events: any[], prefs: any): Date | null {
  let current = new Date(start);
  const durationMs = durationMinutes * 60000;

  while (current.getTime() + durationMs <= end.getTime()) {
    const slotEnd = new Date(current.getTime() + durationMs);
    
    const hasConflict = events.some(event => {
      const eventStart = new Date(event.start.dateTime || event.start.date);
      const eventEnd = new Date(event.end.dateTime || event.end.date);
      return (current < eventEnd && slotEnd > eventStart);
    });

    const isPreferred = checkPreferences(current, slotEnd, prefs);

    if (!hasConflict && isPreferred) {
      return new Date(current);
    }

    current = new Date(current.getTime() + 15 * 60000); // Step by 15 mins
  }

  return null;
}

function checkPreferences(start: Date, end: Date, prefs: any): boolean {
  // Respect focus_hours and family_time (simplified for MVP)
  // For now, let's just avoid family_time (18:00-20:00 daily as per integration_specs)
  const startHour = start.getHours();
  const endHour = end.getHours();

  // If overlaps with 18:00-20:00
  if ((startHour < 20 && endHour > 18)) {
    return false;
  }

  return true;
}

async function createAutomatedEvent(userId: string, title: string, startTime: Date, durationMinutes: number, confidenceScore: number = 1.0) {
  const userPrefs = await query(`SELECT plan FROM app_users WHERE id = '${userId}'`);
  const plan = userPrefs[0]?.plan || 'free';

  if (plan === 'free') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyCountResult = await query(`SELECT COUNT(*) as count FROM app_flexible_tasks 
      WHERE user_id = '${userId}' AND deadline >= '${weekAgo.toISOString()}'`);
    
    const count = (weeklyCountResult[0] as any).count;
    if (count >= 5) {
      console.log(`Automation skipped for user ${userId}: Free plan limit reached (5/week)`);
      return;
    }
  }

  // TRIAGE STATUS: Confidence threshold
  const status = confidenceScore < 0.8 ? 'requires_approval' : 'completed';

  if (status === 'completed') {
    const auth = await getAuthenticatedClient(userId);
    if (auth) {
      const calendar = google.calendar({ version: 'v3', auth });
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      try {
        await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: title,
            description: 'Automated by Simplifi AI',
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
            transparency: 'opaque',
          },
        });
      } catch (error) {
        console.error(`Error creating Google Calendar event for user ${userId}:`, error);
      }
    }
  }

  const taskId = Math.random().toString(36).substring(2, 15);
  await query(`INSERT INTO app_flexible_tasks (id, user_id, title, duration_minutes, deadline, status, confidence_score) 
    VALUES ('${taskId}', '${userId}', '${title.replace(/'/g, "''")}', ${durationMinutes}, '${startTime.toISOString()}', '${status}', ${confidenceScore})`);
  
  console.log(`Created automated task: ${title} for user ${userId} with status: ${status} (Confidence: ${confidenceScore})`);
}
