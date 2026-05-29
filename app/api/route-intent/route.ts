import type { PathType, ResolvedPath } from "@/lib/phrases";

export const runtime = "nodejs";

const SYSTEM = `You are an intent classifier for Felipe Mejia's portfolio website.
Classify the visitor's message into one of three paths: hiring, consulting, or exploring.

Rules:
- "hiring": they are a recruiter, employer, HR, talent team, or evaluating Felipe as a candidate/hire
- "consulting": they need a consultant, freelancer, advisor, or want to work with Felipe on a project/problem
- "exploring": curious, learning, browsing, no clear intent yet

Also extract:
- emphasis: 2-3 short strings of what they specifically care about (e.g. "AI workflow", "CPO role", "growth audit")
- greeting: a warm 1-sentence personalised greeting (max 12 words) addressing their specific context
- cvHint: "product" | "growth" | "ai" | "general" — which CV variant is most relevant

Respond ONLY with valid JSON in this exact shape:
{
  "type": "hiring" | "consulting" | "exploring",
  "emphasis": ["string", "string"],
  "greeting": "string",
  "cvHint": "product" | "growth" | "ai" | "general"
}`;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { message?: string };
  const message = (body.message || "").trim().slice(0, 600);

  if (!message) {
    return Response.json(fallback("exploring", message));
  }

  // Quick local classification for the three suggestion chips
  const lower = message.toLowerCase();
  if (lower.includes("hiring") || lower.includes("evaluating") || lower.includes("recruit")) {
    return Response.json(fallback("hiring", message));
  }
  if (lower.includes("consultant") || lower.includes("builder") || lower.includes("project") || lower.includes("help")) {
    return Response.json(fallback("consulting", message));
  }
  if (lower.includes("exploring") || lower.includes("curious") || lower.includes("just")) {
    return Response.json(fallback("exploring", message));
  }

  // AI classification for free-form messages
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(fallback("exploring", message));
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user",   content: message },
        ],
        max_tokens: 200,
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return Response.json(fallback("exploring", message));

    const data = await res.json() as { choices: { message: { content: string } }[] };
    const parsed = JSON.parse(data.choices[0]?.message?.content ?? "{}") as Partial<ResolvedPath>;
    const type = (["hiring","consulting","exploring"].includes(parsed.type ?? "")) ? parsed.type as PathType : "exploring";

    return Response.json({
      type,
      context: message,
      emphasis: parsed.emphasis ?? [],
      greeting: parsed.greeting ?? defaultGreeting(type),
      cvHint:   parsed.cvHint   ?? "general",
    } satisfies ResolvedPath);
  } catch {
    return Response.json(fallback("exploring", message));
  }
}

function defaultGreeting(type: PathType) {
  if (type === "hiring")     return "Here's what matters most for someone evaluating a hire.";
  if (type === "consulting") return "Here's how I work and what we can build together.";
  return "Take a look around — start wherever feels relevant.";
}

function fallback(type: PathType, context: string): ResolvedPath {
  return {
    type,
    context,
    emphasis: [],
    greeting: defaultGreeting(type),
    cvHint: type === "hiring" ? "product" : type === "consulting" ? "growth" : "general",
  };
}
