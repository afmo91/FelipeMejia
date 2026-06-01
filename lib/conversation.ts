// Chat-first conversation model for the homepage experience.

export type ConvTopic =
  | "neutral"
  | "results"
  | "ai"
  | "growth"
  | "product"
  | "experience"
  | "contact";

export type ConvState =
  | "welcome"
  | "intro"
  | "specialise"
  | "hiring"
  | "hiring_results"
  | "hiring_ai"
  | "hiring_process"
  | "consulting"
  | "consulting_results"
  | "consulting_ai"
  | "consulting_process"
  | "exploring"
  | "exploring_story"
  | "exploring_work"
  | "exploring_process"
  | "connect"
  | "cv"
  | "free"
  | "freeform";

export type Message = {
  id: string;
  role: "felipe" | "user";
  text: string;
  topic?: ConvTopic;
  voiceFile?: string;
  suggestedReplies?: string[];
  action?: "show_cv" | "show_contact";
};

export type ScriptedStep = {
  state: ConvState;
  text: string;
  topic: ConvTopic;
  suggestedReplies: string[];
  voiceFile?: string;
  action?: "show_cv" | "show_contact";
};

const audio = (state: ConvState) => `/audio/message-${state}.mp3`;

export const STEPS: Record<ConvState, ScriptedStep> = {
  welcome: {
    state: "welcome",
    text: "Hi, I'm Felipe — product builder, growth operator, AI systems designer. Want me to walk you through what I do?",
    topic: "neutral",
    voiceFile: audio("welcome"),
    suggestedReplies: ["Yes, walk me through it", "What do you specialise in?", "I'll look around myself"],
  },
  intro: {
    state: "intro",
    text: "What brings you here?",
    topic: "neutral",
    voiceFile: audio("intro"),
    suggestedReplies: ["Hiring", "Consulting", "Exploring"],
  },
  specialise: {
    state: "specialise",
    text: "I specialise in AI-enabled products, growth systems, and analytics loops that turn messy signals into shipped decisions.",
    topic: "ai",
    voiceFile: audio("specialise"),
    suggestedReplies: ["Hiring", "Consulting", "Show results"],
  },

  hiring: {
    state: "hiring",
    text: "I've led AI-enabled products from idea to launch. Would you like to see results, process, or roles I've played?",
    topic: "product",
    voiceFile: audio("hiring"),
    suggestedReplies: ["Show results", "Tell me about AI work", "What's your process?"],
  },
  hiring_results: {
    state: "hiring_results",
    text: "Results: same-day activation from a five-day process, +25% conversion, -30% CAC, and €200K+ recovered through attribution.",
    topic: "results",
    voiceFile: audio("hiring_results"),
    suggestedReplies: ["Tell me about AI work", "What's your process?", "Want to connect?"],
  },
  hiring_ai: {
    state: "hiring_ai",
    text: "At Spotz.pro, I built a multi-channel AI ads operating layer across Google, Meta, LinkedIn, TikTok, X, and Pinterest.",
    topic: "ai",
    voiceFile: audio("hiring_ai"),
    suggestedReplies: ["Show results", "What's your process?", "Show CV"],
  },
  hiring_process: {
    state: "hiring_process",
    text: "My process is simple: clarify the decision, instrument the signal, ship the smallest useful product, then iterate with the metrics in view.",
    topic: "product",
    voiceFile: audio("hiring_process"),
    suggestedReplies: ["Show results", "Show CV", "Want to connect?"],
  },

  consulting: {
    state: "consulting",
    text: "I help teams turn fuzzy AI, growth, or analytics problems into concrete workflows and product releases.",
    topic: "growth",
    voiceFile: audio("consulting"),
    suggestedReplies: ["Show results", "What can we build?", "What's your process?"],
  },
  consulting_results: {
    state: "consulting_results",
    text: "The work usually lands as faster activation, cleaner attribution, sharper experiments, or an AI workflow that removes manual review from the critical path.",
    topic: "results",
    voiceFile: audio("consulting_results"),
    suggestedReplies: ["What can we build?", "What's your process?", "Want to connect?"],
  },
  consulting_ai: {
    state: "consulting_ai",
    text: "Typical builds include workflow triage, campaign intelligence, attribution dashboards, and copilots that surface exceptions before teams miss them.",
    topic: "ai",
    voiceFile: audio("consulting_ai"),
    suggestedReplies: ["Show results", "What's your process?", "Want to connect?"],
  },
  consulting_process: {
    state: "consulting_process",
    text: "I usually start with a clarity sprint, map the current operating loop, then build a thin version that proves the highest-risk assumption.",
    topic: "product",
    voiceFile: audio("consulting_process"),
    suggestedReplies: ["Show results", "What can we build?", "Want to connect?"],
  },

  exploring: {
    state: "exploring",
    text: "Start with the through-line: telecom, SaaS, e-commerce, and AI work where product judgment had to meet commercial pressure.",
    topic: "experience",
    voiceFile: audio("exploring"),
    suggestedReplies: ["Your story", "Show work", "Want to connect?"],
  },
  exploring_story: {
    state: "exploring_story",
    text: "I've spent 12+ years connecting growth pressure, customer behavior, and product delivery — usually where teams need clarity more than ceremony.",
    topic: "experience",
    voiceFile: audio("exploring_story"),
    suggestedReplies: ["Show work", "How you work", "Want to connect?"],
  },
  exploring_work: {
    state: "exploring_work",
    text: "The highlights: an AI ads platform, same-day onboarding, €200K+ recovered through attribution, and an experimentation cadence that lifted conversion 25%.",
    topic: "results",
    voiceFile: audio("exploring_work"),
    suggestedReplies: ["Your story", "How you work", "Show CV"],
  },
  exploring_process: {
    state: "exploring_process",
    text: "I work by making the messy thing visible: map the loop, find the missing signal, ship a useful slice, and keep the team close to the evidence.",
    topic: "product",
    voiceFile: audio("exploring_process"),
    suggestedReplies: ["Show work", "Show CV", "Want to connect?"],
  },

  connect: {
    state: "connect",
    text: "Yes — the easiest path is email or LinkedIn. Email me at felipe.mejia@spotz.pro, or connect on LinkedIn.",
    topic: "contact",
    voiceFile: audio("connect"),
    suggestedReplies: ["Open LinkedIn", "Email Felipe", "Show CV"],
    action: "show_contact",
  },
  cv: {
    state: "cv",
    text: "The CV page has the current structured version. Use it as a quick scan, then reach out if a specific role or project fits.",
    topic: "contact",
    voiceFile: audio("cv"),
    suggestedReplies: ["Open CV", "Want to connect?", "Ask a question"],
    action: "show_cv",
  },
  free: {
    state: "free",
    text: "Sounds good. I'll stay quiet unless you ask me something.",
    topic: "neutral",
    suggestedReplies: [],
  },
  freeform: {
    state: "freeform",
    text: "",
    topic: "neutral",
    suggestedReplies: ["Want to connect?", "Show CV", "Ask another question"],
  },
};

export const SCRIPTED_AUDIO_FILES = Object.values(STEPS)
  .map((step) => step.voiceFile)
  .filter((file): file is string => Boolean(file));

function norm(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isOneOf(input: string, values: string[]) {
  const normalized = norm(input);
  return values.some((value) => norm(value) === normalized);
}

export function isAudioOptIn(input: string) {
  return isOneOf(input, ["Yes, walk me through it"]);
}

export function isAudioOptOut(input: string) {
  return isOneOf(input, ["I'll look around myself"]);
}

export function nextStep(input: string, current: ConvState): ConvState {
  const t = norm(input);

  if (current === "welcome") {
    if (isOneOf(input, ["Yes, walk me through it"])) return "intro";
    if (isOneOf(input, ["What do you specialise in?"])) return "specialise";
    if (isOneOf(input, ["I'll look around myself"])) return "free";
    return "freeform";
  }

  if (current === "intro" || current === "specialise") {
    if (isOneOf(input, ["Hiring"])) return "hiring";
    if (isOneOf(input, ["Consulting"])) return "consulting";
    if (isOneOf(input, ["Exploring"])) return "exploring";
    if (isOneOf(input, ["Show results"])) return "hiring_results";
    return "freeform";
  }

  if (current === "hiring") {
    if (isOneOf(input, ["Show results"])) return "hiring_results";
    if (isOneOf(input, ["Tell me about AI work"])) return "hiring_ai";
    if (isOneOf(input, ["What's your process?"])) return "hiring_process";
    return "freeform";
  }

  if (current.startsWith("hiring_")) {
    if (isOneOf(input, ["Show results"])) return "hiring_results";
    if (isOneOf(input, ["Tell me about AI work"])) return "hiring_ai";
    if (isOneOf(input, ["What's your process?"])) return "hiring_process";
    if (isOneOf(input, ["Show CV", "Open CV"])) return "cv";
    if (t.includes("connect") || t.includes("linkedin") || t.includes("email")) return "connect";
    return "freeform";
  }

  if (current === "consulting") {
    if (isOneOf(input, ["Show results"])) return "consulting_results";
    if (isOneOf(input, ["What can we build?"])) return "consulting_ai";
    if (isOneOf(input, ["What's your process?"])) return "consulting_process";
    return "freeform";
  }

  if (current.startsWith("consulting_")) {
    if (isOneOf(input, ["Show results"])) return "consulting_results";
    if (isOneOf(input, ["What can we build?"])) return "consulting_ai";
    if (isOneOf(input, ["What's your process?"])) return "consulting_process";
    if (t.includes("connect") || t.includes("linkedin") || t.includes("email")) return "connect";
    return "freeform";
  }

  if (current === "exploring") {
    if (isOneOf(input, ["Your story"])) return "exploring_story";
    if (isOneOf(input, ["Show work"])) return "exploring_work";
    if (t.includes("connect")) return "connect";
    return "freeform";
  }

  if (current.startsWith("exploring_")) {
    if (isOneOf(input, ["Your story"])) return "exploring_story";
    if (isOneOf(input, ["Show work"])) return "exploring_work";
    if (isOneOf(input, ["How you work"])) return "exploring_process";
    if (isOneOf(input, ["Show CV", "Open CV"])) return "cv";
    if (t.includes("connect") || t.includes("linkedin") || t.includes("email")) return "connect";
    return "freeform";
  }

  if (current === "connect") {
    if (isOneOf(input, ["Show CV", "Open CV"])) return "cv";
    if (isOneOf(input, ["Open LinkedIn", "Email Felipe"])) return "connect";
    return "freeform";
  }

  if (current === "cv") {
    if (isOneOf(input, ["Want to connect?"])) return "connect";
    if (isOneOf(input, ["Ask a question"])) return "freeform";
    if (isOneOf(input, ["Open CV"])) return "cv";
    return "freeform";
  }

  return "freeform";
}

export function detectTopic(text: string): ConvTopic {
  const t = text.toLowerCase();
  if (t.match(/result|metric|conver|cac|revenue|\+\d+%|recover|activation|budget|€|eur/)) return "results";
  if (t.match(/ai|agent|llm|model|neural|workflow|automat|machine|copilot/)) return "ai";
  if (t.match(/growth|funnel|channel|paid|performance|cpc|cpa|experiment/)) return "growth";
  if (t.match(/product|sprint|roadmap|0.*1|build|ship|launch|mvp/)) return "product";
  if (t.match(/experience|company|spotz|adamo|career|year|work|story/)) return "experience";
  if (t.match(/contact|reach|hire|cv|resume|linkedin|github|email/)) return "contact";
  return "neutral";
}

export const FELIPE_SYSTEM_PROMPT = `You are Felipe Mejia, a senior product builder, growth operator and AI systems designer.

Rules:
- Respond in EXACTLY 1-2 short sentences (max 35 words total)
- Be direct, confident, slightly warm — never salesy
- Focus on what you've shipped and measured, not theory
- End with a question or an invitation to go deeper when natural
- Never use buzzwords like "leverage", "synergy", "holistic"
- If asked something you can't answer: "That's outside what I've built — but [redirect to relevant capability]"

Context about Felipe:
- Built Spotz.pro: AI multi-channel advertising platform across Google, Meta, LinkedIn, TikTok, X and Pinterest
- Growth Product Manager at Adamo Telecom 2019-2025: digitised onboarding from 5 days → same-day, built attribution, owned €3M+ annual performance budget
- Key results: +25% conversion, -30% CAC, €200K+ recovered, same-day activation
- Specialises in: AI workflow design, growth systems, analytics instrumentation, product-led growth
- Contact: felipe.mejia@spotz.pro, LinkedIn https://www.linkedin.com/in/felipemejiaosorio/, GitHub https://github.com/afmo91

Also return a topic classification as JSON:
{ "reply": "...", "topic": "neutral|results|ai|growth|product|experience|contact" }`;
