import { FELIPE_SYSTEM_PROMPT, detectTopic } from "@/lib/conversation";
import type { ConvTopic } from "@/lib/conversation";

export const runtime = "nodejs";

type HistoryMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    message?: string;
    history?: HistoryMessage[];
  };

  const message = (body.message ?? "").trim().slice(0, 400);
  const history = (body.history ?? []).slice(-6); // keep last 3 exchanges

  if (!message) {
    return Response.json(fallback(message));
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(fallback(message));
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
          { role: "system", content: FELIPE_SYSTEM_PROMPT },
          ...history,
          { role: "user", content: message },
        ],
        max_tokens: 120,
        temperature: 0.55,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) return Response.json(fallback(message));

    const data = (await res.json()) as { choices: { message: { content: string } }[] };
    const parsed = JSON.parse(data.choices[0]?.message?.content ?? "{}") as {
      reply?: string;
      topic?: ConvTopic;
    };

    return Response.json({
      reply: parsed.reply ?? fallbackReply(message),
      topic: parsed.topic ?? detectTopic(message),
    });
  } catch {
    return Response.json(fallback(message));
  }
}

function fallbackReply(message: string): string {
  const t = message.toLowerCase();
  if (t.includes("result") || t.includes("number")) {
    return "+25% conversion, €200K+ recovered, same-day activation. All measured. Want to go deeper on any of these?";
  }
  if (t.includes("ai") || t.includes("agent")) {
    return "I build AI layers that classify work, surface exceptions and feed decisions back into dashboards. What's the workflow you're trying to instrument?";
  }
  return "Good question — tell me more about the context and I'll give you the honest version.";
}

function fallback(message: string) {
  return { reply: fallbackReply(message), topic: detectTopic(message) };
}
