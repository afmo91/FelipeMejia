// ─── Types ────────────────────────────────────────────────────────
export type ConvTopic =
  | "neutral" | "results" | "ai" | "growth" | "product" | "experience" | "contact";

export type ConvState =
  | "assembling"
  | "audio_gate"
  | "branching"
  | "hiring_intro"
  | "hiring_results"
  | "hiring_experience"
  | "hiring_cv"
  | "consulting_problem"
  | "consulting_how"
  | "consulting_lab"
  | "consulting_start"
  | "exploring_story"
  | "exploring_work"
  | "connect"
  | "freeform";

export type Message = {
  id: string;
  role: "felipe" | "user";
  text: string;
  topic?: ConvTopic;
  action?: "show_cv" | "show_lab" | "show_contact";
};

export type ScriptedStep = {
  text: string;
  topic: ConvTopic;
  suggestions: string[];
  action?: "show_cv" | "show_lab" | "show_contact";
};

// ─── Scripted conversation steps ──────────────────────────────────
export const STEPS: Record<ConvState, ScriptedStep> = {
  assembling: { text: "", topic: "neutral", suggestions: [] },
  freeform:   { text: "", topic: "neutral", suggestions: [] },

  audio_gate: {
    text: "Hi — I'm Felipe. Before we start, would you like me to talk you through this?",
    topic: "neutral",
    suggestions: ["🔊 Yes, talk to me", "📖 I'll read, thanks"],
  },

  branching: {
    text: "What brings you here?",
    topic: "neutral",
    suggestions: ["I'm hiring or evaluating", "I need a consultant or builder", "Just exploring"],
  },

  // ── Hiring path ────────────────────────────────────────────────
  hiring_intro: {
    text: "12+ years taking products from ambiguous brief to shipped outcome. €3M+ in budget owned. AI platforms built 0→1. What would you like to dig into?",
    topic: "product",
    suggestions: ["Show me the results", "Tell me about your AI work", "Where have you worked?"],
  },
  hiring_results: {
    text: "Same-day activation from a 5-day process. +25% conversion through experimentation. €200K+ recovered through attribution. −30% CAC. All shipped, all measured.",
    topic: "results",
    suggestions: ["Walk me through a case study", "What companies?", "How do I reach you?"],
  },
  hiring_experience: {
    text: "At Spotz.pro I built a multi-channel AI ad platform from zero — Google, Meta, LinkedIn, TikTok, X and Pinterest in one operating model. At Adamo Telecom I digitised onboarding and owned €3M+ in annual performance budget.",
    topic: "experience",
    suggestions: ["Download your CV", "Tell me about your AI systems work", "Let's connect"],
  },
  hiring_cv: {
    text: "I'll put together a brief tailored to your context. Download the CV below, or connect directly — whichever is easier.",
    topic: "contact",
    suggestions: ["Connect on LinkedIn", "Send a message", "What else should I know?"],
    action: "show_cv",
  },

  // ── Consulting path ────────────────────────────────────────────
  consulting_problem: {
    text: "I work best when there's a gap between data and decision — or between an idea and a shipped product. Does that sound like where you are?",
    topic: "growth",
    suggestions: ["Yes, exactly that", "Tell me about your engagements", "Show me the AI work"],
  },
  consulting_how: {
    text: "Three ways to engage: a one-week Clarity Sprint to scope a fuzzy idea, a two-week Growth Audit to find the leaks, or a four-to-six week AI Workflow Build. Which sounds closest?",
    topic: "product",
    suggestions: ["The sprint sounds right", "I need the audit", "Tell me about the AI build"],
  },
  consulting_lab: {
    text: "Describe your challenge and watch it become a scoped product signal. What's the problem you're sitting with?",
    topic: "ai",
    suggestions: ["Skip the demo, let's talk", "What does the AI build look like?", "How do I start?"],
    action: "show_lab",
  },
  consulting_start: {
    text: "Bring the messy version. The first job is to make the opportunity legible. What's stuck?",
    topic: "contact",
    suggestions: ["Let's talk", "Send a message", "I need more context first"],
    action: "show_contact",
  },

  // ── Exploring path ─────────────────────────────────────────────
  exploring_story: {
    text: "12 years. Telecoms, SaaS, e-commerce, AI. Always the person who connects the messy data problem to the shipped product. What are you curious about?",
    topic: "experience",
    suggestions: ["Your AI work", "Your growth systems", "How you work"],
  },
  exploring_work: {
    text: "Four things I'm proud of: an AI ads platform at Spotz.pro, onboarding that went from 5 days to same-day, attribution that recovered €200K+, and an experimentation engine that moved conversion 25%. Any of these relevant?",
    topic: "results",
    suggestions: ["Tell me about the AI platform", "The onboarding story", "What are you building now?"],
  },

  connect: {
    text: "No pitch. If something resonated — reach out. LinkedIn or a quick message both work.",
    topic: "contact",
    suggestions: ["Connect on LinkedIn", "Send a message", "Show me more work"],
    action: "show_contact",
  },
};

// ─── Routing ──────────────────────────────────────────────────────
export function routeUserInput(input: string, current: ConvState): ConvState {
  const t = input.toLowerCase();

  if (current === "audio_gate") return "branching";

  if (current === "branching") {
    if (t.includes("hiring") || t.includes("evaluat")) return "hiring_intro";
    if (t.includes("consult") || t.includes("builder") || t.includes("need")) return "consulting_problem";
    return "exploring_story";
  }

  if (current === "hiring_intro") {
    if (t.includes("result") || t.includes("number") || t.includes("proof")) return "hiring_results";
    if (t.includes("ai") || t.includes("tech") || t.includes("system")) return "hiring_experience";
    return "hiring_results";
  }

  if (current === "hiring_results") {
    if (t.includes("case") || t.includes("study") || t.includes("project")) return "hiring_experience";
    if (t.includes("compan") || t.includes("where") || t.includes("work")) return "hiring_experience";
    return "hiring_cv";
  }

  if (current === "hiring_experience") {
    if (t.includes("cv") || t.includes("resume") || t.includes("download")) return "hiring_cv";
    if (t.includes("connect") || t.includes("linkedin") || t.includes("reach")) return "hiring_cv";
    return "hiring_cv";
  }

  if (current === "consulting_problem") {
    if (t.includes("engagement") || t.includes("how")) return "consulting_how";
    if (t.includes("ai") || t.includes("build")) return "consulting_lab";
    return "consulting_how";
  }

  if (current === "consulting_how") {
    if (t.includes("sprint")) return "consulting_start";
    if (t.includes("audit")) return "consulting_start";
    if (t.includes("ai") || t.includes("build")) return "consulting_lab";
    return "consulting_lab";
  }

  if (current === "consulting_lab") {
    if (t.includes("skip") || t.includes("talk") || t.includes("start")) return "consulting_start";
    return "consulting_start";
  }

  if (current === "exploring_story") {
    if (t.includes("ai") || t.includes("spotz")) return "exploring_work";
    if (t.includes("growth") || t.includes("market")) return "exploring_work";
    return "exploring_work";
  }

  if (current === "exploring_work") return "connect";

  if (current === "connect") {
    if (t.includes("linkedin")) return "connect";
    if (t.includes("message") || t.includes("send")) return "connect";
    return "exploring_story";
  }

  return "freeform";
}

// ─── Topic detection ──────────────────────────────────────────────
export function detectTopic(text: string): ConvTopic {
  const t = text.toLowerCase();
  if (t.match(/result|metric|conver|cac|€|revenue|\+\d+%|recover/)) return "results";
  if (t.match(/ai|agent|llm|model|neural|workflow|automat|machine/))  return "ai";
  if (t.match(/growth|funnel|channel|paid|performance|cpc|cpa/))       return "growth";
  if (t.match(/product|sprint|roadmap|0.*1|build|ship|launch/))        return "product";
  if (t.match(/experience|compan|spotz|adamo|career|year|work/))       return "experience";
  if (t.match(/contact|reach|hire|cv|resume|linkedin|email/))          return "contact";
  return "neutral";
}

// ─── LLM system prompt ────────────────────────────────────────────
export const FELIPE_SYSTEM_PROMPT = `You are Felipe Mejia, a senior product builder, growth operator and AI systems designer.

Rules:
- Respond in EXACTLY 1-2 short sentences (max 35 words total)
- Be direct, confident, slightly warm — never salesy
- Focus on what you've shipped and measured, not theory
- End with a question or an invitation to go deeper
- Never use buzzwords like "leverage", "synergy", "holistic"
- If asked something you can't answer: "That's outside what I've built — but [redirect to relevant capability]"

Context about Felipe:
- Built Spotz.pro: AI multi-channel advertising platform (Google, Meta, LinkedIn, TikTok, X, Pinterest) from 0→1
- Growth Product Manager at Adamo Telecom 2019-2025: digitised onboarding (5 days → same-day), built attribution, owned €3M+ annual performance budget
- Key results: +25% conversion, −30% CAC, €200K+ recovered, same-day activation
- Specialises in: AI workflow design, growth systems, analytics instrumentation, product-led growth

Also return a topic classification as JSON:
{ "reply": "...", "topic": "neutral|results|ai|growth|product|experience|contact" }`;
