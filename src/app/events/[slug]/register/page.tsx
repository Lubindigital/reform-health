import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RegistrationForm } from "@/components/events/RegistrationForm";
import { sanityFetch, EVENT_BY_SLUG_QUERY } from "@/sanity/client";
import { findFallbackEvent, formatEventDate, isUpcoming } from "@/data/events";

// Registration state (spots, past/upcoming) is time-sensitive; render per request.
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PublicEvent {
  title: string;
  eyebrow?: string;
  slug: string;
  format: string;
  startDate: string;
  timeLabel?: string;
  timeZone?: string;
  location: string;
  description?: string;
  isFree?: boolean;
  host?: string;
}

// Public fields only — never meetingLink. That is fetched server-side in the API.
async function getPublicEvent(slug: string): Promise<PublicEvent | null> {
  const published = await sanityFetch<PublicEvent>(EVENT_BY_SLUG_QUERY, { slug });
  if (published?.title) return published;

  const fb = findFallbackEvent(slug);
  if (!fb) return null;
  return {
    title: fb.title,
    eyebrow: fb.eyebrow,
    slug: fb.slug,
    format: fb.format,
    startDate: fb.startDate,
    timeLabel: fb.timeLabel,
    timeZone: fb.timeZone,
    location: fb.location,
    description: fb.description,
    isFree: fb.isFree,
    host: fb.host,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEvent(slug);
  const title = event ? `Register · ${event.title}` : "Register";
  return {
    title: `${title} | ReForm Health Alliance`,
    description: event?.description,
  };
}

function DetailRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 py-3 last:border-b-0">
      <span className="text-[0.68rem] font-bold uppercase tracking-[2px] text-[#8ab0ff]">{label}</span>
      <span className="text-right text-sm font-medium text-white">
        {value}
        {note && <span className="mt-0.5 block text-xs font-normal text-white/50">{note}</span>}
      </span>
    </div>
  );
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getPublicEvent(slug);
  if (!event) notFound();

  const upcoming = isUpcoming(event.startDate);

  return (
    <>
      <Navbar />
      <main className="bg-off-white">
        <section className="bg-gradient-to-br from-[#0a193c] to-[#0f2350] pt-36 pb-16">
          <div className="mx-auto max-w-[1120px] px-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All events
            </Link>
            <span className="mt-6 block text-[0.72rem] font-bold uppercase tracking-[3px] text-[#8ab0ff]">
              {event.isFree ? `Free ${event.format} · Registration` : `${event.format} · Registration`}
            </span>
            <h1 className="mt-3 max-w-[20ch] text-balance font-heading text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-[2.75rem]">
              {event.title}
            </h1>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <div className="rounded-2xl bg-[#0a193c] p-8">
                <h2 className="font-heading text-lg font-bold text-white">Event details</h2>
                <div className="mt-4">
                  <DetailRow label="Date" value={formatEventDate(event.startDate)} />
                  {event.timeLabel && (
                    <DetailRow label="Time" value={event.timeLabel} note={event.timeZone} />
                  )}
                  <DetailRow label="Where" value={event.location} note="Link sent when you register" />
                  {event.host && <DetailRow label="Host" value={event.host} />}
                </div>
              </div>
              {event.description && (
                <p className="mt-6 text-[0.95rem] leading-relaxed text-gray-500">{event.description}</p>
              )}
              <ul className="mt-6 space-y-3">
                {[
                  "Your join link, on screen and by email",
                  "A calendar invite so you don't forget",
                  "Thirty focused minutes, no sales pitch",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {upcoming ? (
                <RegistrationForm eventSlug={event.slug} eventTitle={event.title} />
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_4px_20px_rgba(10,25,60,0.06)] md:p-10">
                  <h2 className="font-heading text-2xl font-bold text-gray-900">This event has ended</h2>
                  <p className="mx-auto mt-3 max-w-[380px] text-[0.95rem] leading-relaxed text-gray-500">
                    Registration for this session is closed. Browse our upcoming events to find the next one.
                  </p>
                  <Link
                    href="/events"
                    className="mt-7 inline-flex items-center justify-center rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep"
                  >
                    See Upcoming Events
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
