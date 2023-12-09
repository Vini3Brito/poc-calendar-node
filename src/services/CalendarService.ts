import { google } from 'googleapis'
import { OAuth2Client } from '../domain'

const CalendarService = () => {
  const listEvents = async (auth: OAuth2Client) => {
    const calendar = google.calendar({version: 'v3' as const, auth});
    const now = new Date()
    const nowPlus1Month = new Date(now)
    nowPlus1Month.setMonth(now.getMonth() + 1)
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: nowPlus1Month.toISOString(),
      maxResults: 4,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
    }
    console.log('Upcoming 10 events: ');
    events.map((event) => {
      const start = event.start?.dateTime || event.start?.date;
      console.log(`${start} - ${event.summary}`);
    });
    return events;
  }

  return {
    listEvents
  }
}

export { CalendarService }
