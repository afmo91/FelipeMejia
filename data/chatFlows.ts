import type { CaseStudyId } from "@/data/caseStudies";
import type { SystemId } from "@/data/systems";

export type FelipeOSView = "command" | "services" | "systems" | "case-studies" | "experience" | "cv" | "contact";

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
    nextActions: ["Show proof of work", "What can you build?", "Open CV"],
  },
  {
    prompt: "Show growth results",
    view: "case-studies",
    caseStudyId: "growth-audit-experimentation-system",
    response: "Growth work is strongest when acquisition, attribution and experiments share one operating loop. Start with the proof layer.",
    nextActions: ["Explore services", "Show me AI systems", "Contact Felipe"],
  },
  {
    prompt: "What can you build?",
    view: "services",
    response: "I sell focused builds: AI workflow sprints, growth system audits, AI assistant builds and practical product/MVP delivery.",
    nextActions: ["Explore services", "Show proof of work", "Contact Felipe"],
  },
  {
    prompt: "Open CV",
    view: "cv",
    response: "The public CV is visible and downloadable. Admin stays private for versions and tailoring, but the professional profile is public.",
    nextActions: ["Show experience", "Contact Felipe", "Show proof of work"],
  },
  {
    prompt: "Show proof of work",
    view: "case-studies",
    caseStudyId: "paid-media-operating-layer",
    response: "Proof of Work uses safe representative systems: problem, system built, commercial value and capabilities without exposing client data.",
    nextActions: ["Show growth results", "Show me AI systems", "Contact Felipe"],
  },
  {
    prompt: "How can you help my company?",
    view: "services",
    response: "Bring the messy workflow, growth problem or AI use case. I map it, ship the useful system and make the metric visible.",
    nextActions: ["Explore services", "Show proof of work", "Contact Felipe"],
  },
  {
    prompt: "What roles fit you best?",
    view: "experience",
    response: "Best fit: product, growth and AI systems roles where shipping, instrumentation and commercial outcomes sit close together.",
    nextActions: ["Open CV", "Show proof of work", "Contact Felipe"],
  },
  {
    prompt: "Contact Felipe",
    view: "contact",
    response: "Use email for project context, LinkedIn for the quick intro, or GitHub if you want to scan builds and technical direction.",
    nextActions: ["Open CV", "Show proof of work", "Show me AI systems"],
  },
  {
    prompt: "Show experience",
    view: "experience",
    response: "The career line is product and growth under commercial pressure: consulting, telecom scale, AI SaaS and automation systems.",
    nextActions: ["Open CV", "Show growth results", "Contact Felipe"],
  },
  {
    prompt: "Explore services",
    view: "services",
    response: "Services are packaged around outcomes: AI workflows, growth visibility, custom assistants and practical product builds.",
    nextActions: ["Show proof of work", "Contact Felipe", "Open CV"],
  },
];
