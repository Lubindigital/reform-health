// Helpers for building an add-to-calendar invite for a webinar.
// Kept dependency-free: we hand-write a tiny, valid iCalendar document.

export interface CalendarEventInput {
  title: string;
  description: string;
  /** The join link, used as LOCATION and URL. */
  location: string;
  /** ISO timestamps. Both required to produce an invite. */
  startsAt: string;
  endsAt: string;
  /** Stable identifier for the event, used in the UID. */
  uid: string;
}

/** Format a Date as an iCalendar UTC timestamp: 20260728T190000Z */
function toICSStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escape text per RFC 5545 (commas, semicolons, backslashes, newlines). */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Build a valid .ics document. Returns null when the timestamps are missing or
 * unparseable, so the caller can simply skip the attachment.
 */
export function buildICS(input: CalendarEventInput, now: Date = new Date()): string | null {
  const start = new Date(input.startsAt);
  const end = new Date(input.endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ReForm Health Alliance//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${input.uid}@reformnv.org`,
    `DTSTAMP:${toICSStamp(now)}`,
    `DTSTART:${toICSStamp(start)}`,
    `DTEND:${toICSStamp(end)}`,
    `SUMMARY:${escapeICS(input.title)}`,
    `DESCRIPTION:${escapeICS(input.description)}`,
    `LOCATION:${escapeICS(input.location)}`,
    `URL:${escapeICS(input.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // iCalendar requires CRLF line endings.
  return lines.join("\r\n");
}

/** A "click to add" Google Calendar template URL. Null if timestamps are bad. */
export function googleCalendarUrl(input: CalendarEventInput): string | null {
  const start = new Date(input.startsAt);
  const end = new Date(input.endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${toICSStamp(start)}/${toICSStamp(end)}`,
    details: `${input.description}\n\nJoin: ${input.location}`,
    location: input.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
