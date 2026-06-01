export type AskFelipeMode = "chat" | "diagnostic";

export type AskFelipeResponse = {
  answer: string;
  stages: string[];
  source: "fallback" | "openai";
};

export const askFelipePrompts = [
  "What kind of AI workflow could Felipe build for us?",
  "How would Felipe improve our onboarding funnel?",
  "What does a first sprint look like?",
  "Show me proof that connects to growth metrics.",
];

const knowledge = [
  "Felipe Mejia is a Product & Growth leader with 12+ years across telecom, e-commerce, and B2B SaaS.",
  "He builds AI-enabled workflows, analytics dashboards, onboarding systems, pricing experiments, and product-led growth loops.",
  "Spotz.pro: built an AI-powered multi-channel advertising operating layer across Google, Meta, LinkedIn, TikTok, X, and Pinterest.",
  "Adamo Telecom: reduced activation from 5 days → same-day, reduced churn by about 15%, improved conversion by 25%, reduced CAC by 30%, recovered €200K+ with attribution, and owned €3M+ annual budget.",
  "Preferred engagement shape: diagnose the system, identify missing signals, scope the smallest useful MVP, ship instrumentation, run experiments, and create a decision cadence.",
].join("\n");

export function getAskFelipeKnowledge() {
  return knowledge;
}

export function buildFallbackAnswer(message: string, mode: AskFelipeMode = "chat"): AskFelipeResponse {
  const lowerMessage = message.toLowerCase();
  const isOnboarding = lowerMessage.includes("onboarding") || lowerMessage.includes("activation");
  const isAi = lowerMessage.includes("ai") || lowerMessage.includes("agent") || lowerMessage.includes("workflow");
  const isGrowth = lowerMessage.includes("growth") || lowerMessage.includes("conversion") || lowerMessage.includes("cac");

  const diagnosis = isOnboarding
    ? "This looks like an activation and time-to-value problem."
    : isGrowth
      ? "This looks like a growth system problem: the funnel needs clearer signals, ownership, and experiment cadence."
      : isAi
        ? "This looks like an AI workflow opportunity: start by finding the repetitive decision or messy handoff."
        : "This looks like a product signal problem: clarify the user outcome, instrument the journey, then scope the smallest shippable move.";

  const aiLayer = isAi
    ? "Use an agent to classify inputs, surface exceptions, draft next actions, and log evidence back into the dashboard."
    : "A useful AI layer could summarize user behavior, flag friction, and recommend the next experiment without replacing product judgment.";

  const answer =
    mode === "diagnostic"
      ? [
          `Diagnosis: ${diagnosis}`,
          "Missing signals: define activation, cohort drop-off, time-to-value, and one revenue or retention proxy.",
          "First sprint: map the workflow, instrument two or three critical events, ship one focused experiment, and review weekly.",
          `AI layer: ${aiLayer}`,
          "Relevant proof: Adamo for onboarding and attribution; Spotz.pro for AI workflow orchestration and cross-channel analytics.",
        ].join("\n")
      : [
          diagnosis,
          "The first move is not a deck. It is a short diagnostic that turns the messy system into signals: where users start, where they stall, what data is missing, and what decision the team needs to make next.",
          `Then I would scope a two-week build/learn sprint. ${aiLayer}`,
          "If this is close to your situation, send me the context and I can turn it into a sharper project brief.",
        ].join("\n\n");

  return {
    answer,
    source: "fallback",
    stages: ["Understand request", "Find product signal", "Map workflow", "Suggest sprint", "Connect proof"],
  };
}
