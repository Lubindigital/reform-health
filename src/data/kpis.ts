export interface Kpi {
  value: string;
  label: string;
  description: string;
}

export const kpis: Kpi[] = [
  {
    value: "$3.5B",
    label: "Annual Waste Redirected",
    description: "Redirecting employer healthcare waste back into Nevada's economy through High Performing Health Plans",
  },
  {
    value: "3%",
    label: "Premium Increase Threshold",
    description: "A not-to-exceed maximum annual increase target to ensure predictable and sustainable costs.",
  },
  {
    value: "100%",
    label: "Employee DPC Access",
    description: "Ensure every plan member has access to advanced, independent primary care.",
  },
];
