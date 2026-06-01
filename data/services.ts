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
      "Workflow map and opportunity brief",
      "Agentic process design",
      "Working prototype",
      "Implementation plan",
    ],
    cta: "Book an AI workflow sprint",
  },
  {
    title: "Growth System Audit",
    description: "Review acquisition, tracking, funnel performance and attribution to identify wasted spend and quick wins.",
    bestFor: "Teams spending on paid acquisition without clear visibility.",
    deliverables: [
      "Acquisition and tracking audit",
      "Funnel diagnosis",
      "Experiment backlog",
      "Prioritized quick wins",
    ],
    cta: "Request a growth audit",
  },
  {
    title: "AI Assistant Build",
    description: "Design and build a custom assistant for support, sales, internal knowledge or document workflows.",
    bestFor: "Teams that want AI embedded in real operations, not just a chatbot demo.",
    deliverables: [
      "Assistant scope and guardrails",
      "Knowledge/context model",
      "Production-ready interface",
      "Human handoff plan",
    ],
    cta: "Build an assistant",
  },
  {
    title: "Product / MVP Build",
    description: "Turn a business process or product idea into a usable web app, dashboard or internal tool.",
    bestFor: "Founders, operators and teams that need a fast, practical product build.",
    deliverables: [
      "Product scope and technical plan",
      "Responsive web app or dashboard",
      "Admin/data workflow",
      "Launch and iteration plan",
    ],
    cta: "Discuss a product build",
  },
];
