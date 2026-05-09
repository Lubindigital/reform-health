import Image from "next/image";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeUp } from "@/components/motion/FadeUp";

interface PressItem {
  href: string;
  outlet: string;
  date: string;
  title: string;
  excerpt: string;
  cta: string;
  image: string;
  imageAlt: string;
}

const pressItems: PressItem[] = [
  {
    href: "https://www.prnewswire.com/news-releases/three-organizations-one-mission-a-new-future-for-nevada-employer-healthcare-302753890.html",
    outlet: "PR Newswire",
    date: "May 7, 2026",
    title: "Three organizations. One mission. A new future for Nevada employer healthcare.",
    excerpt:
      "The official press release announcing Nevada's first High-Performing Health Plan coalition — ReForm Health Alliance, Avergent Health, and Prominence Health.",
    cta: "Read the press release",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Stack of newspapers",
  },
  {
    href: "https://www.kolotv.com/2026/05/07/reno-based-coalition-helping-businesses-find-affordable-reliable-heath-care-their-employees/",
    outlet: "KOLO 8 News Now",
    date: "May 7, 2026",
    title:
      "Reno-based coalition helping businesses find affordable, reliable healthcare for their employees.",
    excerpt:
      "KOLO 8 reports on the new Reno-based partnership making it easier for Nevada employers to offer high-value, lower-cost benefits to their workforce.",
    cta: "Watch the segment",
    image:
      "https://images.unsplash.com/photo-1490642914619-7955a3fd483c?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Microphone in front of a news camera",
  },
  {
    href: "https://nvhphp.health",
    outlet: "A Nevada Partnership",
    date: "April 17, 2026",
    title: "Nevada's High-Performing Health Plan partnership — the full announcement.",
    excerpt:
      "Visit the coalition's joint landing page for the full story of how ReForm, Avergent, and Prominence are rebuilding employer healthcare in Nevada.",
    cta: "Visit nvhphp.health",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Classic van on an open desert road through red rock country",
  },
];

export function InTheNews() {
  return (
    <section id="in-the-news" className="py-24 bg-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <SectionHeader tag="In the News" title="Press & coverage" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pressItems.map((item, i) => (
            <FadeUp key={item.href} delay={i * 0.1}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-off-white rounded-2xl border border-gray-100 overflow-hidden hover:border-navy/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all cursor-pointer group h-full"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="bg-navy/[0.06] text-navy font-bold uppercase tracking-wide px-2.5 py-1 rounded">
                      {item.outlet}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2.5 group-hover:text-navy transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.excerpt}</p>
                  <span className="text-navy text-sm font-semibold">{item.cta} &rarr;</span>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
