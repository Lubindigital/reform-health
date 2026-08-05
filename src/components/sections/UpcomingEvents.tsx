import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import { RegisterButton } from "@/components/events/RegisterButton";
import { sanityFetch, EVENTS_QUERY } from "@/sanity/client";
import {
  mergeEvents,
  formatEventShort,
  getRegisterHref,
  isUpcoming,
  type EventItem,
} from "@/data/events";

interface SanityEvent extends Omit<EventItem, "slug"> {
  _id: string;
  slug: string;
}

async function getNextEvent(): Promise<EventItem | null> {
  const published = await sanityFetch<SanityEvent[]>(EVENTS_QUERY);
  const all = mergeEvents(published?.map(({ _id, ...e }) => ({ ...e, slug: e.slug || _id })));
  return all.find((e) => isUpcoming(e.startDate)) ?? null;
}

function StripItem({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <div className="text-[0.62rem] font-bold uppercase tracking-[2px] text-[#8ab0ff]">{label}</div>
      <div className="mt-1 font-heading text-base font-bold text-white">{value}</div>
      {note && <div className="text-xs text-white/45">{note}</div>}
    </div>
  );
}

export async function UpcomingEvents() {
  const event = await getNextEvent();

  // Nothing on the calendar — hide the section entirely rather than show a shell.
  if (!event) return null;

  const register = getRegisterHref(event);

  return (
    <section id="events" className="bg-white py-24">
      <div className="mx-auto max-w-[1120px] px-6">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-[#0a193c] px-8 py-10 md:px-12 md:py-12">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-navy/30 blur-[120px]" />
              <div className="absolute -top-28 right-[-8%] h-[320px] w-[320px] rounded-full bg-navy-light/12 blur-[110px]" />
            </div>

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="text-[0.7rem] font-bold uppercase tracking-[3px] text-[#8ab0ff]">
                  {event.eyebrow ?? "Upcoming Event"}
                </span>
                <h2 className="mt-4 max-w-[20ch] text-balance font-heading text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-[2.5rem]">
                  {event.title}
                </h2>
                {event.description && (
                  <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-white/60">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="lg:pl-8">
                <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <StripItem label="Date" value={formatEventShort(event.startDate)} />
                  {event.timeLabel && (
                    <StripItem label="Time" value={event.timeLabel} note={event.timeZone} />
                  )}
                  <StripItem label="Where" value={event.location} note={event.locationNote} />
                  {event.isFree && <StripItem label="Cost" value="Free" note="No charge to attend" />}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <RegisterButton
                    href={register.href}
                    internal={register.internal}
                    title={event.title}
                    variant="onDark"
                  />
                  <Link
                    href="/events"
                    className="text-sm font-semibold text-[#8ab0ff] transition-colors hover:text-white"
                  >
                    Event Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
