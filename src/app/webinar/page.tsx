import { redirect } from "next/navigation";
import { sanityFetch, EVENTS_QUERY } from "@/sanity/client";
import { events as fallbackEvents, getRegisterHref, isUpcoming, type EventItem } from "@/data/events";

// Vanity URL: reformnv.org/webinar always points at whatever webinar is currently
// open for registration, so the link stays good across future events.
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SanityEvent extends Omit<EventItem, "slug"> {
  _id: string;
  slug: string;
}

export default async function WebinarRedirect() {
  const published = await sanityFetch<SanityEvent[]>(EVENTS_QUERY);
  const all: EventItem[] =
    published && published.length > 0
      ? published.map(({ _id, ...e }) => ({ ...e, slug: e.slug || _id }))
      : fallbackEvents;

  // Soonest upcoming event that has an open registration flow.
  const target = all.find((e) => {
    if (!isUpcoming(e.startDate)) return false;
    return getRegisterHref(e).internal;
  });

  if (target) redirect(`/events/${target.slug}/register`);

  // Nothing open for registration — send them to the events listing instead.
  redirect("/events");
}
