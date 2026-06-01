export type ExperienceEntry = {
  company: string;
  role: string;
  copy: string;
  proof: string[];
};

export const experienceEntries: ExperienceEntry[] = [
  {
    company: "Segmentta",
    role: "Co-founder / Product & Growth Consultant",
    copy: "Built and scaled a B2B consulting business serving institutional clients in regulated markets.",
    proof: ["30+ institutional clients", "Pfizer, Bayer, Abbott", "€500K+ annual revenue", "Team of 10"],
  },
  {
    company: "Adamo Telecom",
    role: "Growth Product Manager / Digital Acquisition",
    copy: "Led growth and digital product initiatives for a telecom operator with 500K+ customers.",
    proof: ["€3M+ annual media budget", "+25% conversion", "-30% CAC", "5 days -> same-day activation", "-15% first-month churn", "€200K+ recovered"],
  },
  {
    company: "Spotz.pro",
    role: "Founder / Product Builder",
    copy: "Built an AI-powered SaaS platform for multi-channel paid media workflows.",
    proof: ["0->1 product build", "AI recommendations", "Multi-channel API integrations", "Dashboards + lifecycle metrics", "Freemium / usage pricing tests"],
  },
  {
    company: "Consulting / AI Systems",
    role: "Product, Growth & Automation",
    copy: "Helping companies design AI assistants, agentic workflows, API integrations, automation systems and growth infrastructure.",
    proof: ["B2B lead workflows", "Support automation", "CMS / CRM systems", "WhatsApp lead capture", "AI admin assistant concepts", "Performance marketing systems"],
  },
];
