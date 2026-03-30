export interface Kpi {
  value: string;
  label: string;
  description: string;
}

export const kpis: Kpi[] = [
  {
    value: "$3.5B",
    label: "Annual Waste Redirected",
    description: "Redirecting employer healthcare waste back into Nevada's economy through smarter plan design and transparent pricing.",
  },
  {
    value: "Cap",
    label: "Premium Increase Threshold",
    description: "A not-to-exceed maximum annual premium increase, holding insurers accountable to sustainable cost growth.",
  },
  {
    value: "100%",
    label: "Employee DPC Access",
    description: "Every employee of a member organization gains access to advanced independent direct primary care.",
  },
];
