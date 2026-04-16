import { beliefs } from "./beliefs";
import { benefits } from "./benefits";
import { initiatives } from "./initiatives";
import { kpis } from "./kpis";
import { CONTACT } from "@/lib/constants";

export const SITE_CONTEXT = `
# ReForm Health Alliance

## Mission
The ReForm Health Alliance is a collective of leading Nevada organizations working together to deliver better employee healthcare benefits at sustainably lower costs — redirecting billions back to our communities.

Tagline: "Better Outcomes. Lower Costs. Stronger Communities."

## About
The ReForm Health Alliance is more than a coalition — it's a movement. We bring together employers and providers to implement High Performing Health Plans (HPHPs) that empower employers to control spending, improve access and outcomes, and transform health benefits from a liability into a valuable strategic asset.

By aligning incentives, mandating transparency, and facilitating collaboration between providers and employers, we gain momentum and control that no single employer can achieve alone. The result: better healthcare for employees, sustainable and predictable costs for businesses, and stronger communities across Nevada.

## Core Beliefs
${beliefs.map((b) => `- ${b.title}: ${b.description}`).join("\n")}

## Key Initiatives
${initiatives.map((i) => `- ${i.title}: ${i.description}`).join("\n")}

## Membership Benefits
${benefits.map((b) => `- ${b.title}: ${b.description}`).join("\n")}

## Key Performance Targets (North Star)
${kpis.map((k) => `- ${k.value} ${k.label}: ${k.description}`).join("\n")}

## Contact
- Phone: ${CONTACT.phone}
- Location: ${CONTACT.location}
- Website: https://www.reformnv.org
`.trim();
