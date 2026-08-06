import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Beliefs } from "@/components/sections/Beliefs";
import { Kpis } from "@/components/sections/Kpis";
import { Initiatives } from "@/components/sections/Initiatives";
import { Membership } from "@/components/sections/Membership";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";
import { Insights } from "@/components/sections/Insights";
import { InTheNews } from "@/components/sections/InTheNews";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Contact } from "@/components/sections/Contact";
import { HOME_PAGE_QUERY } from "@/sanity/client";
import { draftAwareFetch } from "@/sanity/lib/live";
import type { HomePage } from "@/sanity/homePageTypes";

// Re-fetch on every request so CMS edits show up immediately. The homepage is
// cheap to render and content updates need to be visible the moment dad hits
// Publish in Studio.
//
// Worth revisiting now that <SanityLive /> is mounted: Live Content is designed
// to cache published pages and invalidate them precisely via sync tags, so
// force-dynamic throws away the caching that makes it cheap. Left as-is for now
// because it is the behaviour that has been in production, and changing caching
// and adding visual editing in one step would make a regression hard to place.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // One query for the whole page. Each section falls back to the copy hardcoded
  // in its own component if the document is missing a field, or if Sanity is
  // unreachable — draftAwareFetch returns null rather than throwing.
  const home = (await draftAwareFetch<HomePage>(HOME_PAGE_QUERY)) ?? {};

  return (
    <>
      <Navbar />
      <main>
        <Hero
          headline={home.heroHeadline}
          description={home.heroDescription}
          rotatingWords={home.heroRotatingWords}
          primaryCtaLabel={home.heroPrimaryCtaLabel}
          secondaryCtaLabel={home.heroSecondaryCtaLabel}
          image={home.heroImage}
          imageAlt={home.heroImageAlt}
        />
        <Kpis
          eyebrow={home.northStarEyebrow}
          title={home.northStarTitle}
          kpis={home.kpis}
        />
        <About
          eyebrow={home.aboutEyebrow}
          title={home.aboutTitle}
          body={home.aboutBody}
          images={home.aboutImages}
        />
        <Beliefs
          eyebrow={home.beliefsEyebrow}
          title={home.beliefsTitle}
          beliefs={home.beliefs}
        />
        <Initiatives
          eyebrow={home.initiativesEyebrow}
          title={home.initiativesTitle}
          description={home.initiativesDescription}
          images={home.initiativesImages}
          initiatives={home.initiatives}
        />
        <Membership
          eyebrow={home.membershipEyebrow}
          title={home.membershipTitle}
          description={home.membershipDescription}
          benefits={home.benefits}
        />
        <UpcomingEvents />
        <Insights />
        <InTheNews />
        <CtaBanner
          headline={home.ctaHeadline}
          description={home.ctaDescription}
          buttonLabel={home.ctaButtonLabel}
          image={home.ctaImage}
          imageAlt={home.ctaImageAlt}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
