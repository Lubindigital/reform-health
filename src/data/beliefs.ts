export interface Belief {
  number: string;
  title: string;
  description: string;
}

export const beliefs: Belief[] = [
  {
    number: "01",
    title: "The Status Quo Is Unsustainable",
    description: "Year-over-year premium increases are crippling Nevada businesses and hurting employees. The current system rewards inefficiency and obscures true costs.",
  },
  {
    number: "02",
    title: "40% of Spending Is Waste",
    description: "Nearly half of what employers pay in premiums goes to administrative bloat, inflated pricing, and unnecessary procedures — not to actual patient care.",
  },
  {
    number: "03",
    title: "Outcomes Over Volume",
    description: "Healthcare should be measured by patient outcomes, not the number of procedures performed. We advocate for value-based care models that reward quality.",
  },
  {
    number: "04",
    title: "Data Drives Decisions",
    description: "Employers deserve transparent, actionable data about how their healthcare dollars are spent. We bring cross-employer analytics and independent benchmarking.",
  },
  {
    number: "05",
    title: "Collective Action Works",
    description: "One employer can be ignored. Hundreds cannot. By forming a unified alliance, Nevada employers gain the negotiating power to demand real change.",
  },
];
