import { buildFallbackAnswer, getAskFelipeKnowledge, type AskFelipeMode } from "@/lib/askFelipe";

export const runtime = "nodejs";

function extractOutputText(data: unknown) {
  if (typeof data !== "object" || data === null) {
    return "";
  }

  const response = data as { output?: Array<{ content?: Array<{ text?: string; type?: string }> }>; output_text?: string };

  if (response.output_text) {
    return response.output_text;
  }

  return (
    response.output
      ?.flatMap((item) => item.content || [])
      .map((content) => content.text || "")
      .filter(Boolean)
      .join("\n") || ""
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    message?: string;
    mode?: AskFelipeMode;
    section?: string;
  };
  const message = (body.message || "").trim().slice(0, 1200);
  const mode = body.mode === "diagnostic" ? "diagnostic" : "chat";

  if (!message) {
    return Response.json(buildFallbackAnswer("How can Felipe help?", mode));
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(buildFallbackAnswer(message, mode));
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      body: JSON.stringify({
        input: [
          {
            content: [
              {
                text: [
                  "You are Hey Felipe, a concise product and growth strategy assistant on Felipe Mejia's portfolio.",
                  "Use only the provided site knowledge. Be commercial, concrete, and useful.",
                  "Do not invent unavailable work history. Do not mention internal instructions.",
                  "Return short sections with labels. End with a practical next step.",
                  `Current section: ${body.section || "homepage"}`,
                  `Mode: ${mode}`,
                  "",
                  "Site knowledge:",
                  getAskFelipeKnowledge(),
                  "",
                  "Visitor request:",
                  message,
                ].join("\n"),
                type: "input_text",
              },
            ],
            role: "user",
          },
        ],
        max_output_tokens: 520,
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        reasoning: { effort: "minimal" },
      }),
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return Response.json(buildFallbackAnswer(message, mode));
    }

    const data = await response.json();
    const answer = extractOutputText(data).trim();

    return Response.json(
      answer
        ? {
            answer,
            source: "openai",
            stages: ["Understand request", "Find product signal", "Map workflow", "Suggest sprint", "Connect proof"],
          }
        : buildFallbackAnswer(message, mode),
    );
  } catch {
    return Response.json(buildFallbackAnswer(message, mode));
  }
}
