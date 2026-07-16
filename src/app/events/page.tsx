import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp } from "@/components/motion/FadeUp";
import { FeaturedEvent } from "@/components/events/FeaturedEvent";
import {
  EventCard,
  EventUpdatesPrompt,
  PastEventRow,
} from "@/components/events/EventCard";
import { sanityFetch, EVENTS_QUERY } from "@/sanity/client";
import { events as fallbackEvents, isUpcoming, type EventItem } from "@/data/events";

export const metadata: Metadata = {
  title: "Events | ReForm Health Alliance",
  description:
    "Free webinars and live sessions from the ReForm Health Alliance, showing Nevada employers how to cut healthcare costs without cutting benefits.",
  alternates: { canonical: "https://www.reformnv.org/events" },
  openGraph: {
    title: "Events | ReForm Health Alliance",
    description:
      "Free webinars and live sessions from the ReForm Health Alliance for Nevada employers.",
    url: "https://www.reformnv.org/events",
    type: "website",
  },
};

// Events are time-sensitive, so render fresh on every request rather than
// serving a cached page that still headlines a webinar that already happened.
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SanityEvent extends Omit<EventItem, "slug"> {
  _id: string;
  slug: string;
}

async function getEvents(): Promise<EventItem[]> {
  const published = await sanityFetch<SanityEvent[]>(EVENTS_QUERY);
  if (published && published.length > 0) {
    return published.map(({ _id, ...e }) => ({ ...e, slug: e.slug || _id }));
  }
  return fallbackEvents;
}

export default async function EventsPage() {
  const all = await getEvents();
  const upcoming = all.filter((e) => isUpcoming(e.startDate));
  const [featured, ...moreUpcoming] = upcoming;
  // Most-recent-first for the archive.
  const past = all.filter((e) => !isUpcoming(e.startDate)).reverse();

  return (
    <>
      <Navbar />
      <main>
        {featured ? (
          <FeaturedEvent event={featured} />
        ) : (
          <section className="bg-gradient-to-br from-[#0a193c] to-[#0f2350] pt-40 pb-20">
            <div className="mx-auto max-w-[1120px] px-6">
              <span className="tag">Events</span>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">
                Webinars &amp; Events
              </h1>
              <p className="mt-4 max-w-[560px] text-base leading-relaxed text-white/60">
                Live sessions on what Nevada employers can do right now to lower healthcare costs and
                raise the quality of care their people receive.
              </p>
            </div>
          </section>
        )}

        <section className="bg-off-white py-20">
          <div className="mx-auto max-w-[1120px] px-6">
            {moreUpcoming.length > 0 && (
              <div className="mb-16">
                <h2 className="mb-8 text-xs font-bold uppercase tracking-[3px] text-gray-400">
                  More Upcoming Events
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {moreUpcoming.map((event, i) => (
                    <FadeUp key={event.slug} delay={i * 0.1}>
                      <EventCard event={event} />
                    </FadeUp>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div className="mb-16">
                <h2 className="mb-8 text-xs font-bold uppercase tracking-[3px] text-gray-400">
                  Past Events
                </h2>
                <div className="space-y-3">
                  {past.map((event, i) => (
                    <FadeUp key={event.slug} delay={i * 0.05}>
                      <PastEventRow event={event} />
                    </FadeUp>
                  ))}
                </div>
              </div>
            )}

            {/* Always give the reader a next step: a calm prompt to stay in the loop. */}
            <FadeUp>
              <EventUpdatesPrompt />
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
