import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ImpactNumbers } from "@/components/sections/ImpactNumbers";
import { About } from "@/components/sections/About";
import { Beliefs } from "@/components/sections/Beliefs";
import { Kpis } from "@/components/sections/Kpis";
import { Initiatives } from "@/components/sections/Initiatives";
import { Membership } from "@/components/sections/Membership";
import { Insights } from "@/components/sections/Insights";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ImpactNumbers />
        <About />
        <Beliefs />
        <Kpis />
        <Initiatives />
        <Membership />
        <Insights />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
