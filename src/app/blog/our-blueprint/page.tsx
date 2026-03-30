import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Our Blueprint — A Proclamation for Nevada Employers | ReForm Health Alliance",
  description: "The case for High Performing Health Plans — why Nevada employers must band together to redirect $3.5B in annual healthcare waste back to the economy.",
};

export default function OurBlueprintPage() {
  return (
    <>
      <Navbar />
      <main>
        <article className="pt-36 pb-20">
          <div className="max-w-[720px] mx-auto px-6">
            <Link href="/blog" className="text-navy text-sm font-medium hover:underline mb-8 inline-block">&larr; All Insights</Link>

            <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
              <span className="bg-navy/[0.06] text-navy font-bold uppercase tracking-wide px-2.5 py-1 rounded">Proclamation</span>
              <span>Mar 14, 2026 &middot; 6 min read</span>
            </div>

            <h1 className="font-heading text-4xl md:text-[2.8rem] font-bold text-gray-900 leading-tight tracking-tight mb-3">Our Blueprint</h1>
            <p className="text-xl text-gray-500 mb-4">A Proclamation for Nevada Employers</p>
            <p className="text-sm text-gray-400 mb-12">By <strong className="text-gray-700">Michael Lubin</strong>, Founder</p>

            <div className="prose prose-gray max-w-none [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-gray-900">
              <h2>It&apos;s Time to Take Back Control of Healthcare</h2>
              <p>Nevada employers are being quietly taxed. Not by Carson City. Not by Washington. By the status quo health plan market.</p>
              <p>Every year, premiums rise faster than inflation. Deductibles climb. Networks narrow. Employees feel squeezed. CFOs brace for another &quot;inevitable&quot; 8-12% increase — or more. Brokers repackage the same carriers. Carriers point to &quot;trend.&quot; Hospitals blame labor costs. PBMs blame drug manufacturers. And everyone tells you this is just how it works.</p>
              <p>The status quo health plan market in Nevada is not a functioning marketplace. It is concentrated, opaque, and structurally misaligned with employer interests. A handful of dominant carriers control pricing. Major hospital systems command extraordinary leverage. Pharmacy benefit managers operate behind rebate walls. Employers — the actual purchasers — rarely see their own data, let alone control it.</p>
              <p>The result? Nevada businesses fund inefficiency at scale.</p>
              <p>If you are an employer, healthcare is likely your second or third largest expense after payroll. Yet most companies treat it as a pass-through cost rather than a strategic lever. That is a mistake.</p>
              <p>Healthcare spend is not just a cost. It is a competitiveness issue. It is a wage issue. It is an economic prosperity issue. And it is fixable.</p>

              <h2>The Problem: Fragmented Employers, Consolidated Vendors</h2>
              <p>Nevada employers negotiate alone. Carriers and hospital systems negotiate with scale. That asymmetry drives everything.</p>
              <p>When employers act individually, they lack meaningful negotiating leverage, accept carrier network pricing without transparency, tolerate misaligned PBM contracts, remain blind to profiteering, shift costs to employees instead of fixing root causes, and renew out of inertia.</p>
              <p>Meanwhile, hospitals consolidate and demand higher rates, carriers design products to increase margin rather than optimize outcomes, pharmacy benefit managers profit from spread pricing and rebate games, specialty drug spend explodes without clinical guardrails, and broker compensation rises alongside premium increases.</p>
              <p>The status quo is comfortable for carriers and intermediaries. It is not comfortable for employers — or their employees.</p>

              <h2>The Opportunity: Return $3.5B Annually to Nevada Employers</h2>
              <p>Every year Nevada employers spend in excess of $17.5B annually in health insurance premiums paid to status quo health plans — growing at over 10% every year. Up to 40% of that spend is waste — a combination of unnecessary or avoidable utilization, fraud, and pricing abuse.</p>
              <p>Imagine what the Nevada economy would look like if employers had $3.5B of additional capital to deploy every year. Public entity health insurance trusts would no longer face insolvency. Thousands of jobs would be added or saved. Wages would rise. Retirement plans would grow. Medical debt would decline.</p>

              <h2>The Solution: High Performing Health Plans (HPHP)</h2>
              <p>A High Performing Health Plan is not a different insurance logo. It is a fundamentally different operating model — purpose-built to remove the up to 40% of unnecessary costs that employers are unknowingly funding today.</p>
              <p>An HPHP is built on five core pillars:</p>

              <h3>1. Active and Transparent Plan Administration</h3>
              <p>Employers must own their claims data, have full visibility into unit prices, understand pharmacy spread and rebate flows, ensure broker compensation is transparent and incentive-aligned, have a multi-year strategy to actively manage risk and costs, and audit vendor performance. An HPHP requires transparent contracts with third-party administrators, pharmacy benefit managers, stop-loss carriers, and benefit advisors. No black boxes. No hidden spreads. No misaligned incentives.</p>

              <h3>2. Pharmacy Discipline</h3>
              <p>Pharmacy spend is often the fastest-growing component of total healthcare cost. High performing plans use transparent, pass-through PBM partners, eliminate spread pricing, audit rebate flows, deploy specialty drug management programs, and consider alternative sourcing strategies. You cannot control healthcare spending without controlling pharmacy.</p>

              <h3>3. Independent Primary Care-Centered Design</h3>
              <p>High-performing plans invest upstream — providing members with advanced primary care or Direct Primary Care (DPC), care navigation support, chronic disease management, mental health integration, same or next day appointments, and in-person or virtual access at no cost to members. Primary care is not an expense. It is the foundation of the risk management and cost containment engine.</p>

              <h3>4. Open, Transparent, Patient-Specific Networks</h3>
              <p>High performing health plans remove extractive PPO networks with pricing at 2-200% above fair market value. Instead, they build networks based on quality, price transparency, rational payment, and employer control. These networks are not owned or controlled by a carrier, are portable across TPAs, structured to give employers leverage, and often built around Medicare-based pricing logic.</p>

              <h3>5. Directing Care to High-Value Providers</h3>
              <p>Not all providers deliver equal value. In Nevada, pricing variation can exceed 400% for identical procedures. High performing plans identify high-quality, lower-cost providers, incentivize members to seek higher-value care, provide expert support teams, use reference-based pricing or transparent network strategies, and incorporate direct contracting where appropriate. The goal is simple: pay more for value, not for brand dominance.</p>

              <h2>Why Nevada Employers Must Band Together</h2>
              <p>One employer can improve a plan. An Alliance can reshape a market. When Nevada employers band together, scale creates leverage — collective purchasing power improves negotiating strength, enables better direct contracting, and reduces volatility risk. Shared infrastructure reduces complexity by centralizing expertise while maintaining employer governance. And risk is stabilized as structured alliances aggregate risk and leverage stop-loss effectively.</p>

              <h2>The Economic Case: This Is About Wages</h2>
              <p>Every dollar of waste is a dollar unavailable for higher wages, capital investment, economic expansion, retirement contributions, and community health improvement. Rising premiums are hidden wage suppression. Breaking the status quo is pro-employee.</p>

              <h2>The Call to Action</h2>
              <p>Nevada&apos;s economy depends on resilient employers. Resilient employers require sustainable healthcare strategy and solutions.</p>
              <p>The question is not whether healthcare costs will continue rising. The question is whether Nevada employers will continue funding a system designed without them — or build one designed by them.</p>
              <p>A High Performing Health Plan is disciplined purchasing. It is data-driven governance. It is collective economic self-defense.</p>
              <p><strong>The status quo persists because employers tolerate it. When Nevada employers band together, the market changes. The time to act is now.</strong></p>
            </div>

            <div className="mt-16 p-8 bg-off-white rounded-2xl border border-gray-100 text-center">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Ready to join the movement?</h3>
              <p className="text-gray-500 text-sm mb-5">Learn how your organization can be part of the ReForm Health Alliance.</p>
              <Link href="/#contact" className="inline-block bg-navy text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors">
                Join the Alliance
              </Link>
            </div>

            <Link href="/blog" className="text-navy text-sm font-medium hover:underline mt-10 inline-block">&larr; Back to Insights</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
