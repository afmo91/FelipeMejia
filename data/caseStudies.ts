import type { MockupId } from "@/components/mockups";

export type CaseStudyId =
  | "spotz"
  | "urban-circus"
  | "tejiplast"
  | "mypaperwork"
  | "joe-boxing"
  | "paid-ads-notre-dame";

export type CaseStudy = {
  id: CaseStudyId;
  title: string;
  category: string;
  copy: string;
  mockup: MockupId;
  proof: string[];
  problem: string;
  system: string;
  outcome: string;
  skills: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "spotz",
    title: "Spotz.pro",
    category: "AI SaaS / Paid Media / Product",
    copy: "Built an AI-powered operating layer for paid media teams to monitor, optimize and act across channels.",
    mockup: "spotz",
    proof: ["0->1 product build", "Cross-channel workflows", "AI recommendations + analytics"],
    problem: "Fragmented channel data and slow campaign decisions.",
    system: "A multi-channel dashboard with recommendation logic, monitoring widgets and workflow surfaces.",
    outcome: "A cohesive operating layer for paid media teams to see, decide and act faster.",
    skills: ["Product strategy", "AI UX", "API integrations", "Analytics"],
  },
  {
    id: "urban-circus",
    title: "Urban Circus",
    category: "AI workflows / CRM / Customer support",
    copy: "Designed automation workflows to support B2B growth and reduce repetitive customer support workload before peak season.",
    mockup: "workflow",
    proof: ["Lead generation workflow", "CRM pipeline automation", "Support automation scope"],
    problem: "Manual prospecting and repetitive support triage created avoidable operational drag.",
    system: "Lead capture, enrichment, intent scoring, CRM updates and approval-led outreach drafts.",
    outcome: "A scoped automation system ready to support B2B growth and seasonal support volume.",
    skills: ["Agent design", "CRM logic", "Support automation", "Workflow mapping"],
  },
  {
    id: "tejiplast",
    title: "Tejiplast",
    category: "B2B acquisition / Website / CRM",
    copy: "Built a modern B2B acquisition system combining website, product taxonomy, CMS, WhatsApp lead capture and internal lead management.",
    mockup: "b2b",
    proof: ["Next.js platform", "WhatsApp-first conversion", "Internal CRM logic"],
    problem: "B2B buyers needed a faster path from product discovery to qualified request.",
    system: "Product selector, CMS taxonomy, WhatsApp capture and an internal lead pipeline.",
    outcome: "A clearer acquisition flow with structured leads and fewer manual handoffs.",
    skills: ["Next.js", "CMS modeling", "Lead capture", "B2B UX"],
  },
  {
    id: "mypaperwork",
    title: "MyPaperwork.fr",
    category: "AI assistant / SaaS / Automation",
    copy: "Built an AI assistant concept to simplify administrative paperwork in France through guided flows and document generation.",
    mockup: "admin",
    proof: ["AI-guided workflows", "Document generation", "Web + mobile concept"],
    problem: "Administrative work was confusing, repetitive and hard to complete without context.",
    system: "A guided assistant with checklist generation, profile context and document previews.",
    outcome: "A product concept that turns paperwork into a structured review flow.",
    skills: ["AI assistant UX", "Document flows", "Product concepting", "SaaS design"],
  },
  {
    id: "joe-boxing",
    title: "Joe Boxing / Glofox",
    category: "Website / App / Integration",
    copy: "Designed the digital layer for a physical fitness business, connecting brand, membership, booking and access flows.",
    mockup: "b2b",
    proof: ["Booking + membership", "Integration planning", "Member experience"],
    problem: "A physical business needed a digital membership and booking layer that felt operationally simple.",
    system: "Membership tiers, booking surfaces, access logic and integration planning.",
    outcome: "A clearer member experience connected to the operational stack.",
    skills: ["Service UX", "Integration planning", "Membership flows", "Operations"],
  },
  {
    id: "paid-ads-notre-dame",
    title: "Paid Ads / Notre-Dame",
    category: "Performance marketing / Analytics / Paid growth",
    copy: "Optimized paid acquisition campaigns with clearer targeting, measurement and performance control.",
    mockup: "growth",
    proof: ["Search strategy", "ROAS control", "Performance dashboard"],
    problem: "Campaign spend needed sharper targeting, cleaner measurement and clearer landing-page feedback.",
    system: "Keyword clusters, negative keyword map, ROAS dashboard and conversion notes.",
    outcome: "A performance control layer for making spend decisions with evidence.",
    skills: ["Paid search", "Attribution", "Experimentation", "Analytics"],
  },
];
