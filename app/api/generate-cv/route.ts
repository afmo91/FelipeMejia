export const runtime = "nodejs";

import { getBaseCV } from "@/lib/cv";

const UTM_MAP: Record<string, string> = {
  linkedin_pm:      "product",
  linkedin_growth:  "growth",
  linkedin_ai:      "ai",
  google_pm:        "product",
  google_growth:    "growth",
  referral_ai:      "ai",
  referral_product: "product",
};

const CV_EMPHASIS: Record<string, string> = {
  product: "product management, 0→1 delivery, roadmap ownership, and stakeholder alignment",
  growth:  "growth systems, experimentation, multi-channel marketing, CAC reduction, and conversion optimisation",
  ai:      "AI workflow design, agentic systems, analytics instrumentation, and data-driven product decisions",
  general: "product leadership, growth systems, and AI workflow delivery",
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    context?: string;
    cvHint?: string;
    utmSource?: string;
  };

  // Determine CV variant: UTM first, then AI hint, then general
  const utmVariant = body.utmSource ? (UTM_MAP[body.utmSource] ?? null) : null;
  const variant    = utmVariant ?? body.cvHint ?? "general";
  const emphasis   = CV_EMPHASIS[variant] ?? CV_EMPHASIS.general;
  const context    = (body.context ?? "").trim().slice(0, 400);

  // If no AI key, return a structured static summary
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ summary: staticSummary(variant), variant });
  }

  const cv = getBaseCV();

  const prompt = [
    "You are a CV writer creating a personalised introduction for Felipe Mejia.",
    `The visitor said: "${context || "no context provided"}"`,
    `Focus emphasis on: ${emphasis}`,
    "",
    "Write a 3-sentence tailored introduction paragraph that:",
    "1. Leads with the most relevant experience for this visitor's context",
    "2. Includes one specific metric or result",
    "3. Ends with a clear statement of what Felipe can do for them",
    "",
    "Keep it under 90 words. Professional, confident, no fluff.",
    "",
    "Felipe's CV summary for reference:",
    `Name: ${cv.name}`,
    `Title: ${cv.title}`,
    `Summary: ${cv.summary}`,
    `Key results: +25% conversion, €200K+ recovered, 5 days → same-day activation, €3M+ performance budget`,
    `Companies: Spotz.pro (AI advertising platform, 0→1), Adamo Telecom (growth product, 2019-2025)`,
  ].join("\n");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.4,
      }),
    });

    if (!res.ok) return Response.json({ summary: staticSummary(variant), variant });
    const data = await res.json() as { choices: { message: { content: string } }[] };
    const summary = data.choices[0]?.message?.content?.trim() ?? staticSummary(variant);
    return Response.json({ summary, variant });
  } catch {
    return Response.json({ summary: staticSummary(variant), variant });
  }
}

function staticSummary(variant: string) {
  const summaries: Record<string, string> = {
    product: "Felipe Mejia is a product leader with 12+ years delivering 0→1 platforms and AI-enabled products across telecoms, SaaS and e-commerce. He built an AI-powered multi-channel advertising platform at Spotz.pro and digitised onboarding at Adamo Telecom, reducing activation from 5 days → same-day. He brings a rare combination of strategic clarity and hands-on execution to every engagement.",
    growth:  "Felipe Mejia is a growth and product operator with 12+ years driving measurable revenue impact through experimentation, attribution and multi-channel performance systems. He delivered +25% conversion lift, -30% CAC reduction and €200K+ spend recovery across telecoms and e-commerce. He designs growth systems that compound — not one-off campaigns.",
    ai:      "Felipe Mejia is an AI product builder and growth systems designer with 12+ years shipping data-driven platforms. He built an agentic multi-channel advertising platform at Spotz.pro and created observability and attribution frameworks that turned dashboards into C-level decision inputs. He specialises in the AI layer between your data and your decisions.",
    general: "Felipe Mejia is a product, growth and AI systems leader with 12+ years taking products from 0 to measurable traction. He has managed €3M+ in performance budgets, delivered +25% conversion lift and built AI-powered platforms across telecoms, SaaS and e-commerce. He works best at the intersection of product strategy, data instrumentation and hands-on delivery.",
  };
  return summaries[variant] ?? summaries.general;
}
