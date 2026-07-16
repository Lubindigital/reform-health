import Link from "next/link";
import { RegisterButton } from "@/components/events/RegisterButton";
import {
  formatEventDate,
  formatEventDay,
  formatEventMonth,
  getRegisterHref,
  type EventItem,
} from "@/data/events";

function CalendarBadge({ startDate }: { startDate: string }) {
  return (
    <div className="w-[64px] shrink-0 overflow-hidden rounded-xl border border-navy/15 bg-white text-center">
      <div className="bg-navy py-1 text-[0.65rem] font-bold uppercase tracking-[1.5px] text-white">
        {formatEventMonth(startDate)}
      </div>
      <div className="font-heading py-1.5 text-xl font-bold text-navy">
        {formatEventDay(startDate)}
      </div>
    </div>
  );
}

/** A secondary upcoming event (everything after the featured one). */
export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_2px_16px_rgba(10,25,60,0.05)]">
      <div className="flex items-start gap-4">
        <CalendarBadge startDate={event.startDate} />
        <div className="min-w-0">
          <span className="inline-block rounded bg-navy/[0.06] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-navy">
            {event.format}
          </span>
          <h3 className="mt-2 font-heading text-xl font-bold leading-snug text-gray-900">
            {event.title}
          </h3>
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-gray-600">
        {formatEventDate(event.startDate)}
        {event.timeLabel ? ` · ${event.timeLabel}` : ""}
        {event.timeZone ? ` ${event.timeZone.replace("Time", "").trim()}` : ""}
      </p>
      <p className="mt-1 text-sm text-gray-500">{event.location}</p>

      {event.description && (
        <p className="mt-4 text-sm leading-relaxed text-gray-500">{event.description}</p>
      )}

      <div className="mt-auto pt-6">
        <CardRegister event={event} />
      </div>
    </article>
  );
}

function CardRegister({ event }: { event: EventItem }) {
  const register = getRegisterHref(event);
  if (!register.href) {
    return <span className="text-sm font-semibold text-gray-400">Registration opening soon</span>;
  }
  return (
    <RegisterButton
      href={register.href}
      internal={register.internal}
      title={event.title}
      className="w-full sm:w-auto"
    />
  );
}

/** A past event, rendered as a quiet list row. */
export function PastEventRow({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-6 py-4">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-3 text-xs text-gray-400">
          <span className="rounded bg-gray-100 px-2 py-0.5 font-bold uppercase tracking-wide text-gray-500">
            {event.format}
          </span>
          <span>{formatEventDate(event.startDate)}</span>
        </div>
        <h3 className="font-heading text-lg font-bold text-gray-900">{event.title}</h3>
      </div>
      <span className="text-sm font-medium text-gray-400">Completed</span>
    </div>
  );
}

/** Closing prompt shown when there is nothing (or little) left to list. */
export function EventUpdatesPrompt() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-8 py-12 text-center">
      <h2 className="font-heading text-2xl font-bold text-gray-900">More sessions are on the way</h2>
      <p className="mx-auto mt-3 max-w-[440px] text-base leading-relaxed text-gray-500">
        We host webinars and roundtables for Nevada employers throughout the year. Get in touch and
        we will make sure you hear about the next one.
      </p>
      <Link
        href="/#contact"
        className="mt-7 inline-flex items-center justify-center rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
      >
        Get Event Updates
      </Link>
    </div>
  );
}
