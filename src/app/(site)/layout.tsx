import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";
import { DraftModeBanner } from "@/components/shared/DraftModeBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThirdPartyAnalytics } from "@/components/analytics/ThirdPartyAnalytics";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants";
import { SITE_URL, SITE_NAME, OG_IMAGE, HOME_SHARE, pageOpenGraph, pageTwitter } from "@/lib/seo";
import "../globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  // Every relative URL in metadata (canonicals, OG image) resolves against this,
  // so pages can declare `alternates.canonical: "/blog"` and get the full URL.
  metadataBase: new URL(SITE_URL),
  title: "ReForm Health Alliance | Nevada Employer Coalition for Better Healthcare",
  description:
    "ReForm Health Alliance is a collective of leading Nevada organizations disrupting the health insurance status quo to deliver better care and benefits at sustainably lower costs.",
  keywords: [
    "Nevada employer coalition",
    "healthcare reform Nevada",
    "employer health benefits",
    "high performing health plans",
    "healthcare costs Reno NV",
  ],
  robots: { index: true, follow: true, "max-image-preview": "large" },
  // No site-wide canonical here: a canonical set in the root layout is inherited
  // by every page, which made /blog and each post declare the homepage as their
  // canonical URL. Each page sets its own `alternates.canonical` instead.
  openGraph: pageOpenGraph({ ...HOME_SHARE, path: "/" }),
  twitter: pageTwitter(HOME_SHARE),
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}${OG_IMAGE.url}`,
      description:
        "A collective of leading Nevada organizations disrupting the health insurance status quo to deliver better care and benefits at sustainably lower costs.",
      telephone: CONTACT.phone,
      address: { "@type": "PostalAddress", addressLocality: "Reno", addressRegion: "NV", addressCountry: "US" },
      areaServed: { "@type": "State", name: "Nevada" },
      sameAs: SOCIAL_LINKS.map((l) => l.href),
      contactPoint: [
        { "@type": "ContactPoint", contactType: "customer service", telephone: CONTACT.phone, areaServed: "US", availableLanguage: "English" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading isEnabled does NOT opt this layout out of static rendering in Next
  // 16 — only draftMode().enable()/disable() do, and those only run inside the
  // /api/draft-mode routes. So this gate is free.
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${instrumentSans.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}

        {/*
          Analytics is skipped entirely in draft mode. The Presentation tool
          frames the REAL site, so without this every page an editor looks at in
          the split-screen would fire a GA4 pageview, a LinkedIn pageview and a
          Clarity session recording against production metrics.
        */}
        {!isDraftMode && (
          <>
            <Analytics />
            <SpeedInsights />
            <ThirdPartyAnalytics />
          </>
        )}

        {/*
          Opposite mounting rules, and inverting them is the classic mistake:
          SanityLive must render on EVERY request or published pages stop
          receiving live updates, while VisualEditing must render ONLY in draft
          mode or the overlay runtime ships to real visitors.
        */}
        <SanityLive />
        {isDraftMode && (
          <>
            <VisualEditing />
            <DraftModeBanner />
          </>
        )}

        {/*
          Chat widget switched off 2026-08-05. The component, the /api/chat
          route and the knowledge base in src/data/site-context.ts are all still
          here — re-enable by importing ChatWidget and rendering it again.
        */}
      </body>
    </html>
  );
}
