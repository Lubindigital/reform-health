export interface EventItem {
  slug: string;
  title: string;
  /** A single word inside `title` to render in the accent color (mirrors the promo graphic). */
  emphasisWord?: string;
  /** Kicker above the title, e.g. "Nevada Employer Webinar" */
  eyebrow?: string;
  /** Badge shown on the card, e.g. "Webinar", "Roundtable", "In Person" */
  format: string;
  /** ISO date (YYYY-MM-DD). Used for sorting and for the month/day badge. */
  startDate: string;
  /** The clock time, exactly as it should read, e.g. "12:00 to 12:30 PM" */
  timeLabel?: string;
  /** Time-zone line under the time, e.g. "Pacific Time" */
  timeZone?: string;
  /** Where it happens, e.g. "Google Meet" or "Reno, NV" */
  location: string;
  /** Secondary line under the location, e.g. "Link in registration email" */
  locationNote?: string;
  description: string;
  isFree?: boolean;
  /**
   * External registration URL (e.g. Eventbrite). Leave empty for a gated webinar:
   * if `meetingLink` is set, the Register button routes to the built-in
   * registration page at /events/<slug>/register instead.
   */
  registrationUrl?: string;
  /**
   * The private join link (e.g. a Google Meet URL). NEVER expose this in public
   * GROQ queries or client props — it is only returned by /api/register after a
   * successful submission, so the link stays gated behind the form.
   */
  meetingLink?: string;
  /**
   * Public boolean the events queries expose (via `defined(meetingLink)`) so the
   * UI can tell a gated event apart from an open one without ever shipping the
   * link itself.
   */
  hasRegistration?: boolean;
  /** Exact start/end as ISO timestamps, used only to build calendar invites. */
  startsAt?: string;
  endsAt?: string;
  host?: string;
  speakers?: string[];
  /** Promo graphic (the same one used for the social post) */
  image?: string;
}

// Fallback content used when Sanity has no event documents yet. Once events are
// published in Studio they take over and this list is ignored.
export const events: EventItem[] = [
  {
    slug: "why-traditional-health-plans-are-failing-employers",
    title: "Why Traditional Health Plans Are Failing Employers",
    emphasisWord: "Failing",
    eyebrow: "Nevada Employer Webinar",
    format: "Webinar",
    startDate: "2026-07-28",
    timeLabel: "12:00 to 12:30 PM",
    timeZone: "Pacific Time",
    location: "Google Meet",
    locationNote: "Link sent when you register",
    description:
      "A ReForm Health Alliance introduction to High Performing Health Plans, and how Nevada employers are cutting healthcare costs without cutting benefits.",
    isFree: true,
    // Gated: no external registrationUrl, so the Register button routes to the
    // built-in registration form, which grants this link on success.
    meetingLink: "https://meet.google.com/aaq-mzmb-meb",
    startsAt: "2026-07-28T19:00:00.000Z", // 12:00 PM Pacific (PDT, UTC-7)
    endsAt: "2026-07-28T19:30:00.000Z", // 12:30 PM Pacific
    host: "ReForm Health Alliance",
  },
];

/** Look up a fallback event by slug (used when Sanity has no events yet). */
export function findFallbackEvent(slug: string): EventItem | undefined {
  return events.find((e) => e.slug === slug);
}

/**
 * Merge published Sanity events over the hardcoded ones BY SLUG.
 *
 * Callers used to do `if (published.length > 0) return published`, which meant
 * publishing a single event in Studio made every other event disappear from
 * /events and the homepage panel at once. Merging per-slug lets events be
 * migrated one at a time, and keeps an unpublished or renamed event from
 * silently emptying the page.
 *
 * Returned in ascending date order, which is what the callers assume when they
 * take the first upcoming event as the featured one.
 */
export function mergeEvents(published: EventItem[] | null | undefined): EventItem[] {
  const fromSanity = (published ?? []).filter((e) => e?.slug);
  const claimed = new Set(fromSanity.map((e) => e.slug));
  const remaining = events.filter((e) => !claimed.has(e.slug));

  // startDate is an ISO calendar date (YYYY-MM-DD), so string compare sorts it.
  return [...fromSanity, ...remaining].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );
}

/**
 * Where the "Register" button should point for an event.
 * - A gated event (has `meetingLink`) routes to the built-in registration page.
 * - Otherwise an external `registrationUrl` opens in a new tab.
 * - Neither → null (button shows "Registration opening soon").
 */
export function getRegisterHref(event: EventItem): { href: string | null; internal: boolean } {
  // `meetingLink` is present only in the fallback data; published events expose
  // `hasRegistration` instead (the link is stripped from public queries).
  if (event.meetingLink || event.hasRegistration) {
    return { href: `/events/${event.slug}/register`, internal: true };
  }
  if (event.registrationUrl) return { href: event.registrationUrl, internal: false };
  return { href: null, internal: false };
}

/** Pacific time — the alliance is Nevada-based, so all event dates read in PT. */
const EVENT_TIME_ZONE = "America/Los_Angeles";

function toEventDate(startDate: string): Date {
  // Noon UTC keeps the calendar day stable across time zones.
  return new Date(`${startDate}T12:00:00Z`);
}

export function formatEventMonth(startDate: string): string {
  return toEventDate(startDate).toLocaleDateString("en-US", {
    month: "short",
    timeZone: EVENT_TIME_ZONE,
  });
}

export function formatEventDay(startDate: string): string {
  return toEventDate(startDate).toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: EVENT_TIME_ZONE,
  });
}

/** Long form, e.g. "Tuesday, July 28, 2026" */
export function formatEventDate(startDate: string): string {
  return toEventDate(startDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: EVENT_TIME_ZONE,
  });
}

/** Compact form for the detail strip, e.g. "Tue, Jul 28" */
export function formatEventShort(startDate: string): string {
  return toEventDate(startDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: EVENT_TIME_ZONE,
  });
}

/** An event stays "upcoming" through the end of its own day (Pacific). */
export function isUpcoming(startDate: string, now: Date = new Date()): boolean {
  return new Date(`${startDate}T23:59:59-07:00`).getTime() >= now.getTime();
}
