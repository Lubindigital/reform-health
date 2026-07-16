import { FadeUp } from "@/components/motion/FadeUp";
import { RegisterButton } from "@/components/events/RegisterButton";
import { formatEventShort, getRegisterHref, type EventItem } from "@/data/events";

/** Render the title, tinting one word in the accent color to mirror the promo graphic. */
function TitleWithEmphasis({ title, word }: { title: string; word?: string }) {
  if (!word) return <>{title}</>;
  const idx = title.indexOf(word);
  if (idx === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, idx)}
      <span className="text-[#8ab0ff]">{word}</span>
      {title.slice(idx + word.length)}
    </>
  );
}

function StripCell({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="px-6 py-5">
      <dt className="text-[0.68rem] font-bold uppercase tracking-[2px] text-[#8ab0ff]">{label}</dt>
      <dd className="mt-1.5 font-heading text-lg font-bold leading-snug text-white">{value}</dd>
      {note && <p className="mt-0.5 text-sm text-white/50">{note}</p>}
    </div>
  );
}

export function FeaturedEvent({ event }: { event: EventItem }) {
  const register = getRegisterHref(event);
  return (
    <section className="relative overflow-hidden bg-[#0a193c]">
      {/* Atmosphere: soft brand-blue glows echo the promo graphic's lighting. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-48 -left-40 h-[560px] w-[560px] rounded-full bg-navy/30 blur-[140px]" />
        <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-navy-light/12 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1120px] px-6 pt-36 pb-16 md:pt-44 md:pb-20">
        <FadeUp>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <span className="text-[0.72rem] font-bold uppercase tracking-[3px] text-[#8ab0ff]">
              {event.eyebrow ?? `${event.format} · Upcoming`}
            </span>
            {event.isFree && (
              <span className="rounded-full border border-[#8ab0ff]/40 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[2px] text-[#8ab0ff]">
                Free {event.format}
              </span>
            )}
          </div>

          <h1 className="mt-6 max-w-[17ch] text-balance font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[3.75rem]">
            <TitleWithEmphasis title={event.title} word={event.emphasisWord} />
          </h1>

          {event.description && (
            <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-white/65">
              {event.description}
            </p>
          )}
        </FadeUp>

        <FadeUp delay={0.1}>
          <dl className="mt-10 grid grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <StripCell label="Date" value={formatEventShort(event.startDate)} />
            {event.timeLabel && (
              <StripCell label="Time" value={event.timeLabel} note={event.timeZone} />
            )}
            <StripCell label="Where" value={event.location} note={event.locationNote} />
          </dl>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <RegisterButton
              href={register.href}
              internal={register.internal}
              title={event.title}
              variant="onDark"
            />
            {event.host && <span className="text-sm text-white/50">Hosted by {event.host}</span>}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/10 pt-6 text-xs text-white/40">
            <span className="font-semibold text-white/55">reformnv.org</span>
            <span aria-hidden>·</span>
            <span>Reno, Nevada</span>
            <span aria-hidden>·</span>
            <span>Built on the Health Rosetta model</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
