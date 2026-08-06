import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";
import { DraftModeBanner } from "@/components/shared/DraftModeBanner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThirdPartyAnalytics } from "@/components/analytics/ThirdPartyAnalytics";
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
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.reformnv.org/" },
  openGraph: {
    title: "ReForm Health Alliance | Better Care. Lower Costs. Stronger Communities.",
    description: "A collective of leading Nevada organizations disrupting the health insurance status quo.",
    type: "website",
    locale: "en_US",
  },
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ReForm Health Alliance",
              description: "Nevada employer coalition disrupting the health insurance status quo",
              telephone: "775-636-5005",
              url: "https://www.reformnv.org",
              address: { "@type": "PostalAddress", addressLocality: "Reno", addressRegion: "NV", addressCountry: "US" },
            }),
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
