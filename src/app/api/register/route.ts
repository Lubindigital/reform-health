import { NextRequest, NextResponse } from "next/server";
import { createPrivateDocument } from "@/sanity/lib/writeClient";
import { sanityFetch, EVENT_MEETING_QUERY } from "@/sanity/client";
import { findFallbackEvent, formatEventDate, type EventItem } from "@/data/events";
import { buildICS, googleCalendarUrl } from "@/lib/ics";
import { sendWebinarLinkEmail, sendRegistrationNotification } from "@/lib/email";
import { verifyTurnstile, clientIp } from "@/lib/turnstile";

export const runtime = "nodejs";

interface MeetingInfo {
  title?: string;
  slug?: string;
  meetingLink?: string;
  startsAt?: string;
  endsAt?: string;
  timeLabel?: string;
  timeZone?: string;
  startDate?: string;
  location?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Look up the private meeting details server-side: Sanity first, then fallback. */
async function getMeetingInfo(slug: string): Promise<MeetingInfo | null> {
  const published = await sanityFetch<MeetingInfo>(EVENT_MEETING_QUERY, { slug });
  if (published?.meetingLink) return published;

  const fallback: EventItem | undefined = findFallbackEvent(slug);
  if (fallback?.meetingLink) {
    return {
      title: fallback.title,
      slug: fallback.slug,
      meetingLink: fallback.meetingLink,
      startsAt: fallback.startsAt,
      endsAt: fallback.endsAt,
      timeLabel: fallback.timeLabel,
      timeZone: fallback.timeZone,
      startDate: fallback.startDate,
      location: fallback.location,
    };
  }
  return null;
}

function buildWhenLabel(info: MeetingInfo): string {
  const parts: string[] = [];
  if (info.startDate) parts.push(formatEventDate(info.startDate));
  const time = [info.timeLabel, info.timeZone].filter(Boolean).join(" ");
  if (time) parts.push(time);
  return parts.join(" · ");
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (clean(body.website)) {
    return NextResponse.json({ success: true, meetingLink: null });
  }

  // Bot check. Fails open until TURNSTILE_SECRET_KEY is configured.
  const human = await verifyTurnstile(clean(body.turnstileToken, 4000), clientIp(request));
  if (!human) {
    return NextResponse.json(
      { success: false, error: "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  const firstName = clean(body.firstName, 100);
  const lastName = clean(body.lastName, 100);
  const company = clean(body.company, 150);
  const email = clean(body.email, 200);
  const eventSlug = clean(body.eventSlug, 200);
  const eventTitle = clean(body.eventTitle, 300);

  if (!firstName || !lastName || !company || !email) {
    return NextResponse.json(
      { success: false, error: "Please fill in every field." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid work email." },
      { status: 400 },
    );
  }
  if (!eventSlug) {
    return NextResponse.json({ success: false, error: "Missing event." }, { status: 400 });
  }

  const info = await getMeetingInfo(eventSlug);
  const meetingLink = info?.meetingLink ?? null;
  const resolvedTitle = eventTitle || info?.title || "ReForm Health Alliance Webinar";
  const whenLabel = info ? buildWhenLabel(info) : "";

  // Build the calendar invite when we have exact timestamps and a link.
  let icsContent: string | null = null;
  let gcalUrl: string | null = null;
  if (meetingLink && info?.startsAt && info?.endsAt) {
    const calInput = {
      title: resolvedTitle,
      description: `Your ReForm Health Alliance webinar. Join here: ${meetingLink}`,
      location: meetingLink,
      startsAt: info.startsAt,
      endsAt: info.endsAt,
      uid: `${eventSlug}-${email}`,
    };
    icsContent = buildICS(calInput);
    gcalUrl = googleCalendarUrl(calInput);
  }

  // Persist + notify in parallel; none of these should block the response, so a
  // transient email/CMS hiccup still lets the registrant see their link.
  const results = await Promise.allSettled([
    // Draft, not published — the dataset is public. See writeClient.
    createPrivateDocument({
      _type: "eventRegistration",
      firstName,
      lastName,
      company,
      email,
      eventTitle: resolvedTitle,
      eventSlug,
      source: "webinar-registration",
      submittedAt: new Date().toISOString(),
    }),
    meetingLink
      ? sendWebinarLinkEmail({
          to: email,
          firstName,
          eventTitle: resolvedTitle,
          meetingLink,
          whenLabel,
          icsContent,
          googleCalendarUrl: gcalUrl,
        })
      : Promise.resolve(),
    sendRegistrationNotification({ firstName, lastName, company, email, eventTitle: resolvedTitle }),
  ]);

  // Surface partial failures (Sanity write / attendee email / notify) in logs so
  // a lost registration or unsent link is debuggable without failing the request.
  const steps = ["sanity-write", "attendee-email", "notify-email"];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[register] ${steps[i]} failed for ${email} (${eventSlug}):`, r.reason);
    }
  });

  return NextResponse.json({ success: true, meetingLink, googleCalendarUrl: gcalUrl });
}
