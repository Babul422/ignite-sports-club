export function generateIcsContent(sport: {
  id: string;
  name: string;
  schedule: string;
  facility: string;
}): string {
  // schedule format example: "Mon, Wed, Fri • 17:00 - 19:30"
  const [daysPart = '', timesPart = ''] = sport.schedule.split('•').map((s) => s.trim());
  const [startTimeStr = '17:00', endTimeStr = '19:30'] = timesPart
    .split('-')
    .map((s) => s.trim());

  // Map 3-letter day abbreviations to iCalendar BYDAY codes
  const dayMapping: Record<string, string> = {
    mon: 'MO',
    tue: 'TU',
    wed: 'WE',
    thu: 'TH',
    fri: 'FR',
    sat: 'SA',
    sun: 'SU',
  };

  const rawDays = daysPart
    .split(',')
    .map((d) => d.trim().toLowerCase().slice(0, 3));
  const byDays = rawDays
    .map((d) => dayMapping[d])
    .filter(Boolean);

  const rruleDays = byDays.length > 0 ? byDays.join(',') : 'MO,WE,FR';

  // Use an upcoming Monday or base date for consistent recurrence
  // E.g., reference start on next Monday or current year reference:
  // Let's create an anchor date for a Monday at start time
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const startHour = startTimeStr.split(':')[0]?.padStart(2, '0') || '17';
  const startMin = startTimeStr.split(':')[1]?.padStart(2, '0') || '00';
  const endHour = endTimeStr.split(':')[0]?.padStart(2, '0') || '19';
  const endMin = endTimeStr.split(':')[1]?.padStart(2, '0') || '30';

  const dtStart = `${year}${month}${day}T${startHour}${startMin}00`;
  const dtEnd = `${year}${month}${day}T${endHour}${endMin}00`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `ignite-${sport.id}-${Date.now()}@ignitesportsclub.com`;
  const location = sport.facility.replace(/\r?\n/g, ' ').trim();
  const summary = `Ignite ${sport.name} Team Training`;
  const description = `Weekly recurring training session for Ignite Sports Club ${sport.name}. Schedule: ${sport.schedule}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ignite Sports Club//Training Schedules//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${rruleDays}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(sport: {
  id: string;
  name: string;
  schedule: string;
  facility: string;
}): void {
  const icsContent = generateIcsContent(sport);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${sport.id}-training-schedule.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
