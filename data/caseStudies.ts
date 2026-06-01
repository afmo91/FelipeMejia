import type { MockupId } from "@/components/mockups";

export type CaseStudyId =
  | "paid-media-operating-layer"
  | "b2b-lead-crm-automation"
  | "ai-support-assistant"
  | "ai-admin-document-assistant"
  | "product-website-cms-conversion"
  | "growth-audit-experimentation-system";

export type CaseStudy = {
  id: CaseStudyId;
  title: string;
  subtitle: string;
  category: string;
  copy: string;
  mockup: MockupId;
  proof: string[];
  problem: string;
  system: string;
  commercialValue: string;
  capabilities: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "paid-media-operating-layer",
    title: "AI Paid Media Operating Layer",
    subtitle: "Cross-channel campaign monitoring, recommendations and workflow control.",
    category: "AI SaaS / Paid Media / Product",
    copy: "A representative operating layer for paid teams that need one place to monitor, decide and act across channels.",
    mockup: "spotz",
    proof: ["Cross-channel monitoring", "AI recommendations", "Lifecycle metrics"],
    problem: "Paid teams often work across disconnected platforms, inconsistent data and manual optimization routines.",
    system:
      "A unified operating layer with cross-channel dashboards, workflow actions, AI recommendations and lifecycle metrics.",
    commercialValue:
      "Helps teams monitor performance, identify budget opportunities and reduce manual campaign management work.",
    capabilities: [
      "Multi-channel API integrations",
      "Paid media strategy",
      "AI recommendations",
      "Dashboard design",
      "Lifecycle instrumentation",
    ],
  },
  {
    id: "b2b-lead-crm-automation",
    title: "B2B Lead Generation & CRM Automation",
    subtitle: "From traffic and outreach to qualified pipeline.",
    category: "B2B acquisition / CRM / Automation",
    copy: "A safe, generic lead system pattern for teams that lose demand between pages, messages, spreadsheets and CRM.",
    mockup: "b2b",
    proof: ["Lead capture", "CRM routing", "Pipeline visibility"],
    problem: "B2B teams often lose leads between website forms, WhatsApp, spreadsheets, CRM and manual follow-up.",
    system:
      "A lead workflow connecting acquisition pages, qualification logic, CRM updates, follow-up sequences and pipeline tracking.",
    commercialValue: "Reduces manual coordination and gives teams a clearer view of pipeline quality.",
    capabilities: [
      "Lead capture",
      "CRM automation",
      "Outreach workflows",
      "WhatsApp / email routing",
      "Pipeline tracking",
    ],
  },
  {
    id: "ai-support-assistant",
    title: "AI Support Assistant",
    subtitle: "Classify, answer and route repetitive support requests.",
    category: "AI support / SAV / Knowledge workflows",
    copy: "A support automation concept that keeps humans in control while reducing repetitive triage and answer drafting.",
    mockup: "workflow",
    proof: ["Ticket classification", "Drafted answers", "Human handoff"],
    problem: "Support teams spend too much time on repetitive questions and manual classification.",
    system:
      "An AI assistant concept that classifies requests, drafts answers, retrieves relevant knowledge and escalates edge cases.",
    commercialValue: "Reduces repetitive workload while keeping humans in control for sensitive cases.",
    capabilities: [
      "Knowledge base retrieval",
      "Ticket classification",
      "Drafted responses",
      "Human handoff",
      "Support analytics",
    ],
  },
  {
    id: "ai-admin-document-assistant",
    title: "AI Admin & Document Assistant",
    subtitle: "Guided workflows for paperwork-heavy processes.",
    category: "AI assistant / Document workflows / SaaS",
    copy: "A guided assistant pattern for turning confusing, document-heavy processes into structured product flows.",
    mockup: "admin",
    proof: ["Guided questions", "Generated drafts", "Checklist logic"],
    problem: "Users struggle to know which document is needed, what information is missing and how to format requests.",
    system: "A guided assistant with checklists, profile context, document previews and generated drafts.",
    commercialValue: "Turns confusing admin processes into structured workflows.",
    capabilities: [
      "AI chat assistant",
      "Document generation",
      "Checklist logic",
      "User context",
      "Web/mobile product concept",
    ],
  },
  {
    id: "product-website-cms-conversion",
    title: "Product Website + CMS + Conversion System",
    subtitle: "Websites that work as acquisition systems, not brochures.",
    category: "Web product / CMS / Conversion",
    copy: "A commercial website system built around offer clarity, content operations and trackable demand capture.",
    mockup: "b2b",
    proof: ["Next.js front end", "CMS structure", "Conversion paths"],
    problem: "Many B2B and local business websites fail to explain the offer, capture demand or route leads correctly.",
    system:
      "A modern website with CMS structure, product/service taxonomy, conversion paths, tracking and lead capture.",
    commercialValue: "Improves clarity, lead quality and the team's ability to update content without developers.",
    capabilities: [
      "Next.js websites",
      "CMS/admin tools",
      "Product taxonomy",
      "Conversion UX",
      "Tracking and analytics",
    ],
  },
  {
    id: "growth-audit-experimentation-system",
    title: "Growth Audit & Experimentation System",
    subtitle: "Find waste, improve funnels and create a repeatable testing cadence.",
    category: "Growth / Analytics / Experimentation",
    copy: "A growth operating pattern for teams that need clearer acquisition signal before spending more.",
    mockup: "growth",
    proof: ["Funnel audit", "Attribution model", "Experiment backlog"],
    problem: "Growth teams often spend without clear attribution, consistent tests or reliable funnel visibility.",
    system:
      "A diagnostic framework for acquisition, landing pages, tracking, attribution and experiment prioritization.",
    commercialValue:
      "Helps teams reduce wasted spend and identify the highest-leverage growth opportunities.",
    capabilities: [
      "Paid ads audit",
      "Attribution modeling",
      "Funnel analytics",
      "Experiment design",
      "CAC / ROAS optimization",
    ],
  },
];
