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
    description: "AI embedded in real workflows to answer, search, draft, classify, qualify and route work with humans in control.",
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
    description: "Multi-step operating loops that research, decide, route and update systems without manual coordination.",
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
    title: "Automation & APIs",
    description: "Automation and API connections that move work across tools without copy-paste or lost context.",
    examples: ["Gmail", "Notion", "CRM", "WhatsApp", "Google Ads / Meta Ads", "Stripe"],
    mockup: "b2b",
    signal: "APIs connected",
  },
  {
    id: "growth-systems",
    title: "Growth Systems",
    description: "Growth infrastructure, not just campaigns: funnel tracking, attribution, experimentation and decision dashboards.",
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
    description: "From messy process to operating system: usable products, dashboards and internal tools shipped fast.",
    examples: ["SaaS MVPs", "Admin panels", "Client portals", "CMS tools", "AI-first workflows", "Dashboards"],
    mockup: "spotz",
    signal: "0→1 shipped",
  },
];
