import type { CaseStudyId } from "@/data/caseStudies";
import type { SystemId } from "@/data/systems";

export type FelipeOSView = "command" | "systems" | "case-studies" | "experience" | "cv" | "contact";

export type ChatRoute = {
  prompt: string;
  view: FelipeOSView;
  response: string;
  systemId?: SystemId;
  caseStudyId?: CaseStudyId;
  nextActions: string[];
};

export const quickPrompts: ChatRoute[] = [
  {
    prompt: "Show me AI systems",
    view: "systems",
    systemId: "ai-assistants",
    response: "Here are the AI systems I build: assistants, agentic workflows and integrations that remove manual coordination from messy operations.",
    nextActions: ["Show case studies", "What can you build?", "Open CV"],
  },
  {
    prompt: "Show growth results",
    view: "case-studies",
    caseStudyId: "paid-ads-notre-dame",
    response: "Growth work is strongest when acquisition, attribution and experiments share one operating loop. Start with the proof layer.",
    nextActions: ["Show me AI systems", "Show case studies", "Contact Felipe"],
  },
  {
    prompt: "What can you build?",
    view: "systems",
    systemId: "product-builds",
    response: "I build productized systems: AI assistants, workflow agents, dashboards, CRM integrations, acquisition funnels and SaaS MVPs.",
    nextActions: ["Show me AI systems", "Show growth results", "Contact Felipe"],
  },
  {
    prompt: "Open CV",
    view: "cv",
    response: "The full CV workspace is protected for tailored versions and downloadable PDFs. The public profile stays aligned with the base CV.",
    nextActions: ["Show experience", "Contact Felipe", "Show case studies"],
  },
  {
    prompt: "Show case studies",
    view: "case-studies",
    caseStudyId: "spotz",
    response: "These are representative product renders, not raw screenshots: cohesive mockups that show the systems and proof without exposing client data.",
    nextActions: ["Show growth results", "Show me AI systems", "Contact Felipe"],
  },
  {
    prompt: "How can you help my company?",
    view: "systems",
    systemId: "automation-integrations",
    response: "Bring the messy workflow. I map the handoffs, connect the data, ship a useful system and make the metrics visible.",
    nextActions: ["Show case studies", "Show growth results", "Contact Felipe"],
  },
  {
    prompt: "What roles fit you best?",
    view: "experience",
    response: "Best fit: product, growth and AI systems roles where shipping, instrumentation and commercial outcomes sit close together.",
    nextActions: ["Open CV", "Show case studies", "Contact Felipe"],
  },
  {
    prompt: "Contact Felipe",
    view: "contact",
    response: "Use email for project context, LinkedIn for the quick intro, or GitHub if you want to scan builds and technical direction.",
    nextActions: ["Open CV", "Show case studies", "Show me AI systems"],
  },
  {
    prompt: "Show experience",
    view: "experience",
    response: "The career line is product and growth under commercial pressure: consulting, telecom scale, AI SaaS and automation systems.",
    nextActions: ["Open CV", "Show growth results", "Contact Felipe"],
  },
];
