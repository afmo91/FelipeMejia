import type { MockupId } from "@/components/mockups";

export type SystemId =
  | "ai-assistants"
  | "agentic-workflows"
  | "automation-integrations"
  | "growth-systems"
  | "product-builds";

export type SystemModule = {
  id: SystemId;
  title: string;
  description: string;
  examples: string[];
  mockup: MockupId;
  signal: string;
};

export const systems: SystemModule[] = [
  {
    id: "ai-assistants",
    title: "AI Assistants",
    description: "Custom assistants that help teams answer, search, draft, classify, qualify and execute.",
    examples: [
      "Customer support assistants",
      "Internal copilots",
      "Sales assistants",
      "Admin/document assistants",
      "Job/application assistants",
    ],
    mockup: "admin",
    signal: "Copilot layer",
  },
  {
    id: "agentic-workflows",
    title: "Agentic Workflows",
    description: "Multi-step agents that research, decide, route and update systems without manual coordination.",
    examples: [
      "Lead enrichment",
      "Automated outreach",
      "CRM updates",
      "Decision support",
      "Follow-up sequences",
    ],
    mockup: "workflow",
    signal: "Research + route",
  },
  {
    id: "automation-integrations",
    title: "Automation & Integrations",
    description: "Connecting tools, APIs and data sources so work moves without copy-paste.",
    examples: ["Gmail", "Notion", "CRM", "WhatsApp", "Google Ads / Meta Ads", "Stripe"],
    mockup: "b2b",
    signal: "APIs connected",
  },
  {
    id: "growth-systems",
    title: "Growth Systems",
    description: "Paid acquisition, funnel tracking, attribution and experimentation systems built for measurable growth.",
    examples: [
      "Paid ads strategy",
      "Landing page tests",
      "CAC reduction",
      "ROAS dashboards",
      "Attribution models",
    ],
    mockup: "growth",
    signal: "Funnel instrumented",
  },
  {
    id: "product-builds",
    title: "Product Builds",
    description: "From MVP to internal tools, I build usable products that solve real operational problems.",
    examples: ["SaaS MVPs", "Admin panels", "Client portals", "CMS tools", "AI-first workflows", "Dashboards"],
    mockup: "spotz",
    signal: "0->1 shipped",
  },
];
