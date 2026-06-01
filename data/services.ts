export type ServiceOffer = {
  title: string;
  description: string;
  bestFor: string;
  deliverables: string[];
  cta: string;
};

export const services: ServiceOffer[] = [
  {
    title: "AI Workflow Sprint",
    description: "Map one high-value workflow, design the agentic process and ship a working prototype.",
    bestFor: "Teams with repetitive research, support, admin or CRM tasks.",
    deliverables: [
      "Workflow audit",
      "Agent map",
      "Prototype",
      "Integration plan",
    ],
    cta: "Book an AI workflow sprint",
  },
  {
    title: "Growth System Audit",
    description: "Review acquisition, tracking, funnel performance and attribution to identify wasted spend and quick wins.",
    bestFor: "Teams spending on paid acquisition without clear visibility.",
    deliverables: [
      "Tracking review",
      "CAC/ROAS analysis",
      "Experiment backlog",
      "Dashboard recommendations",
    ],
    cta: "Request a growth audit",
  },
  {
    title: "AI Assistant Build",
    description: "Design and build a custom assistant for support, sales, internal knowledge or document workflows.",
    bestFor: "Teams that want AI embedded in real operations, not just a chatbot demo.",
    deliverables: [
      "Assistant scope",
      "Prompt/workflow design",
      "Knowledge base connection",
      "Human handoff logic",
    ],
    cta: "Build an assistant",
  },
  {
    title: "Product / MVP Build",
    description: "Turn a business process or product idea into a usable web app, dashboard or internal tool.",
    bestFor: "Founders, operators and teams that need a fast, practical product build.",
    deliverables: [
      "Product scope",
      "UX flow",
      "MVP build",
      "Deployment plan",
    ],
    cta: "Discuss a product build",
  },
];
