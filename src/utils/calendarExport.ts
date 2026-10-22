// Helper to escape RFC 5545 TEXT values (commas, semicolons, backslashes, newlines)
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export function generateIcsContent(
  sport: {
    id: string;
    name: string;
    schedule: string;
    facility: string;
  },
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
): string {
  // schedule format example: "Mon, Wed, Fri • 17:00 - 19:30"
  const [daysPart = '', timesPart = ''] = sport.schedule.split('•').map((s) => s.trim());
  const [startTimeStr = '17:00', endTimeStr = '19:30'] = timesPart
    .split('-')
    .map((s) => s.trim());

  // Map 3-letter day abbreviations to iCalendar BYDAY codes and JS Day index (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const dayMapping: Record<string, { code: string; dayIndex: number }> = {
    sun: { code: 'SU', dayIndex: 0 },
    mon: { code: 'MO', dayIndex: 1 },
    tue: { code: 'TU', dayIndex: 2 },
    wed: { code: 'WE', dayIndex: 3 },
    thu: { code: 'TH', dayIndex: 4 },
    fri: { code: 'FR', dayIndex: 5 },
    sat: { code: 'SA', dayIndex: 6 },
  };

  const rawDays = daysPart
    .split(',')
    .map((d) => d.trim().toLowerCase().slice(0, 3));

  const validDays = rawDays
    .map((d) => dayMapping[d])
    .filter(Boolean);

  const byDays = validDays.map((d) => d.code);
  const rruleDays = byDays.length > 0 ? byDays.join(',') : 'MO,WE,FR';

  // RFC 5545: Find the first scheduled occurrence on or after today to ensure DTSTART matches recurrence rule
  const now = new Date();
  const allowedDayIndices = validDays.length > 0 ? validDays.map((d) => d.dayIndex) : [1, 3, 5]; // fallback Mon, Wed, Fri

  let daysToAdd = 0;
  for (let offset = 0; offset < 7; offset++) {
    const candidateDay = (now.getDay() + offset) % 7;
    if (allowedDayIndices.includes(candidateDay)) {
      daysToAdd = offset;
      break;
    }
  }

  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToAdd);
  const year = startDate.getFullYear();
  const month = String(startDate.getMonth() + 1).padStart(2, '0');
  const day = String(startDate.getDate()).padStart(2, '0');

  const startHour = startTimeStr.split(':')[0]?.padStart(2, '0') || '17';
  const startMin = startTimeStr.split(':')[1]?.padStart(2, '0') || '00';
  const endHour = endTimeStr.split(':')[0]?.padStart(2, '0') || '19';
  const endMin = endTimeStr.split(':')[1]?.padStart(2, '0') || '30';

  const dtStart = `${year}${month}${day}T${startHour}${startMin}00`;
  const dtEnd = `${year}${month}${day}T${endHour}${endMin}00`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Stable UID per sport to prevent duplicate calendar entries across repeated downloads
  const uid = `ignite-${sport.id}-training@ignitesportsclub.com`;
  const location = escapeIcsText(sport.facility.replace(/\r?\n/g, ' ').trim());
  const summary = escapeIcsText(`Ignite ${sport.name} Team Training`);
  const description = escapeIcsText(
    `Weekly recurring training session for Ignite Sports Club ${sport.name}. Schedule: ${sport.schedule}`
  );

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ignite Sports Club//Training Schedules//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=${timeZone}:${dtStart}`,
    `DTEND;TZID=${timeZone}:${dtEnd}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${rruleDays}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(
  sport: {
    id: string;
    name: string;
    schedule: string;
    facility: string;
  },
  timeZone?: string
): void {
  const icsContent = generateIcsContent(sport, timeZone);
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
