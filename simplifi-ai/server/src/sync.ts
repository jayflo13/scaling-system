import { google } from 'googleapis';
import { query } from './db';

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

    for (const event of events) {
      await processEventForAutomations(userId, event, events, prefs);
    }
  } catch (error) {
    console.error(`Error syncing calendar for user ${userId}:`, error);
  }
}

async function processEventForAutomations(userId: string, event: any, allEvents: any[], prefs: any) {
  const summary = (event.summary || '').toLowerCase();
  if (summary.startsWith('📅 [simplifi]')) return; // Don't process our own automated events

  if (summary.includes('flight') || summary.includes('departure')) {
    await handleFlightAutomation(userId, event, allEvents, prefs);
  }

  if (summary.includes('doctor') || summary.includes('dentist') || summary.includes('appointment')) {
    await handleOffsiteAutomation(userId, event, allEvents, prefs);
  }
}

async function handleFlightAutomation(userId: string, flightEvent: any, allEvents: any[], prefs: any) {
  const departureTime = new Date(flightEvent.start.dateTime || flightEvent.start.date);
  const packingTitle = `📅 [Simplifi] Packing for Flight: ${flightEvent.summary}`;
  
  const existing = await query(`SELECT * FROM app_flexible_tasks WHERE user_id = '${userId}' AND title = '${packingTitle}'`);
  if (existing.length > 0) return;

  // Search for a 90-minute gap the evening before (17:00 - 22:00)
  const targetDate = new Date(departureTime);
  targetDate.setDate(targetDate.getDate() - 1);
  
  const searchStart = new Date(targetDate);
  searchStart.setHours(17, 0, 0, 0);
  const searchEnd = new Date(targetDate);
  searchEnd.setHours(22, 0, 0, 0);

  const slot = findGap(searchStart, searchEnd, 90, allEvents, prefs);

  if (slot) {
    await createAutomatedEvent(userId, packingTitle, slot, 90);
  } else {
    console.log(`No 90-minute gap found for packing for user ${userId} on ${targetDate.toDateString()}`);
  }
}

async function handleOffsiteAutomation(userId: string, appointmentEvent: any, allEvents: any[], prefs: any) {
  const startTime = new Date(appointmentEvent.start.dateTime || appointmentEvent.start.date);
  const endTime = new Date(appointmentEvent.end.dateTime || appointmentEvent.end.date);
  
  const bufferBeforeTitle = `📅 [Simplifi] Travel to ${appointmentEvent.summary}`;
  const bufferAfterTitle = `📅 [Simplifi] Travel from ${appointmentEvent.summary}`;

  const existing = await query(`SELECT * FROM app_flexible_tasks WHERE user_id = '${userId}' AND title = '${bufferBeforeTitle}'`);
  if (existing.length > 0) return;

  const bufferBeforeStart = new Date(startTime.getTime() - 30 * 60000);
  const bufferAfterStart = new Date(endTime);

  // For buffers, we just add them and let the user know if there's a conflict
  await createAutomatedEvent(userId, bufferBeforeTitle, bufferBeforeStart, 30);
  await createAutomatedEvent(userId, bufferAfterTitle, bufferAfterStart, 30);
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

async function createAutomatedEvent(userId: string, title: string, startTime: Date, durationMinutes: number) {
  const auth = await getAuthenticatedClient(userId);
  if (!auth) return;

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

    const taskId = Math.random().toString(36).substring(2, 15);
    await query(`INSERT INTO app_flexible_tasks (id, user_id, title, duration_minutes, deadline, status) 
      VALUES ('${taskId}', '${userId}', '${title.replace(/'/g, "''")}', ${durationMinutes}, '${startTime.toISOString()}', 'completed')`);
    
    console.log(`Created automated event: ${title} for user ${userId} at ${startTime.toISOString()}`);
  } catch (error) {
    console.error(`Error creating automated event for user ${userId}:`, error);
  }
}
