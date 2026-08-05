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
import { sanityFetch, SITE_SETTINGS_QUERY } from "@/sanity/client";

// Re-fetch on every request so CMS edits show up immediately. The homepage is
// cheap to render and content updates need to be visible the moment dad hits
// Publish in Studio.
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SiteSettings {
  heroHeadline?: string;
  heroDescription?: string;
  rotatingWords?: string[];
  ctaHeadline?: string;
  ctaDescription?: string;
}

export default async function Home() {
  // Pull editable copy from Sanity. Falls back to component defaults if Sanity
  // is unreachable or the singleton hasn't been created yet.
  const settings = (await sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY)) ?? {};

  return (
    <>
      <Navbar />
      <main>
        <Hero
          headline={settings.heroHeadline}
          description={settings.heroDescription}
          rotatingWords={settings.rotatingWords}
        />
        <Kpis />
        <About />
        <Beliefs />
        <Initiatives />
        <Membership />
        <UpcomingEvents />
        <Insights />
        <InTheNews />
        <CtaBanner
          headline={settings.ctaHeadline}
          description={settings.ctaDescription}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
