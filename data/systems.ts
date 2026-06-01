import type { MockupId } from "@/components/mockups";

export type SystemId =
  | "ai-assistants"
  | "agentic-workflows"
  | "automation-integrations"
  | "growth-systems"
  | "product-dashboards"
  | "product-builds";

export type SystemModule = {
  id: SystemId;
  title: string;
  description: string;
  examples: string[];
  tools: string[];
  commercialValue: string;
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
    tools: ["OpenAI/LLMs", "Knowledge bases", "CRM", "Helpdesk", "Document workflows"],
    commercialValue: "Reduces repetitive work while preserving human review for sensitive cases.",
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
    tools: ["APIs", "CRM", "Email", "Research sources", "Automation runners"],
    commercialValue: "Turns manual handoffs into repeatable decision and routing loops.",
    mockup: "workflow",
    signal: "Research + route",
  },
  {
    id: "automation-integrations",
    title: "Automation & APIs",
    description: "Automation and API connections that move work across tools without copy-paste or lost context.",
    examples: ["Gmail", "Notion", "CRM", "WhatsApp", "Google Ads / Meta Ads", "Stripe"],
    tools: ["REST APIs", "Webhooks", "HubSpot", "Salesforce", "WhatsApp", "Stripe"],
    commercialValue: "Removes coordination drag and makes operational data usable across the stack.",
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
    tools: ["Google Ads", "Meta Ads", "GA4", "Looker/Data Studio", "CRM", "SQL"],
    commercialValue: "Finds wasted spend, improves funnel visibility and creates a practical testing cadence.",
    mockup: "growth",
    signal: "Funnel instrumented",
  },
  {
    id: "product-dashboards",
    title: "Product Dashboards",
    description: "Decision dashboards that connect product, growth and operational signals in one working view.",
    examples: [
      "Lifecycle metrics",
      "Activation dashboards",
      "C-level reporting",
      "Client portals",
      "Workflow status",
    ],
    tools: ["GA4", "Mixpanel", "Tableau", "Looker/Data Studio", "SQL", "CRM"],
    commercialValue: "Makes teams faster because the relevant signal is visible before the meeting starts.",
    mockup: "spotz",
    signal: "Decision layer",
  },
  {
    id: "product-builds",
    title: "Product Builds",
    description: "From messy process to operating system: usable products, dashboards and internal tools shipped fast.",
    examples: ["SaaS MVPs", "Admin panels", "Client portals", "CMS tools", "AI-first workflows", "Dashboards"],
    tools: ["Next.js", "Vercel", "APIs", "CMS", "Auth", "Analytics"],
    commercialValue: "Turns a business process or product idea into something real enough to use, test and sell.",
    mockup: "spotz",
    signal: "0→1 shipped",
  },
];
