"use client";

import { useState } from "react";

const STAGES_CONSULTING = [
  "Mapping your workflow challenge",
  "Identifying missing signals",
  "Scoping a first sprint",
  "Recommending an AI layer",
  "Connecting to proof of impact",
];

const STAGES_GENERAL = [
  "Understanding your context",
  "Finding the product signal",
  "Mapping the workflow",
  "Suggesting a sprint",
  "Connecting to proof",
];

type Props = {
  mode?: "consulting" | "general";
  context?: string;
};

export default function LabSection({ mode = "general", context }: Props) {
  const stages = mode === "consulting" ? STAGES_CONSULTING : STAGES_GENERAL;
  const [input, setInput]         = useState(context ?? "");
  const [activeStage, setActive]  = useState<number>(-1);
  const [answer, setAnswer]       = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  async function run() {
    if (!input.trim()) return;
    setLoading(true);
    setAnswer(null);

    // Animate through stages
    for (let i = 0; i < stages.length; i++) {
      setActive(i);
      await new Promise((r) => setTimeout(r, 900));
    }

    try {
      const res = await fetch("/api/ask-felipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          mode: mode === "consulting" ? "diagnostic" : "chat",
          section: mode === "consulting" ? "consulting" : "lab",
        }),
      });
      const data = await res.json() as { answer?: string };
      setAnswer(data.answer ?? "Something went wrong. Please try again.");
    } catch {
      setAnswer("I would start by identifying the user outcome, the missing signal, and the smallest workflow we can ship to learn.");
    } finally {
      setLoading(false);
      setActive(-1);
    }
  }

  return (
    <div className="lab-root">
      <p className="section-eyebrow">AI Signal Lab</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>
        {mode === "consulting" ? "Describe your challenge. Get a scoped brief." : "Try a live AI diagnostic."}
      </h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem", marginBottom: "1.25rem" }}>
        {mode === "consulting"
          ? "Tell me about the messy workflow, the stuck funnel, or the decision you can't make. Watch it become a product signal and sprint scope."
          : "Describe a product, growth, or workflow challenge. The agent maps it to a signal and suggests a first move."}
      </p>

      <div className="lab-input-wrap" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "40rem" }}>
        <textarea
          className="hub-field"
          rows={3}
          placeholder={mode === "consulting"
            ? "e.g. Our onboarding takes 5 days and we lose 30% of users before activation..."
            : "e.g. We have lots of data but no clear picture of what's driving growth..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ minHeight: "5rem" }}
        />
        <button
          className="hub-btn-primary"
          onClick={run}
          disabled={loading || !input.trim()}
          style={{ alignSelf: "flex-start" }}
        >
          {loading ? "Analysing…" : mode === "consulting" ? "Run diagnostic" : "Analyse signal"}
        </button>
      </div>

      {/* Stage progress */}
      {(loading || answer) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.25rem" }}>
          {stages.map((stage, i) => (
            <div
              key={stage}
              className={`lab-stage ${
                i === activeStage ? "lab-stage-active" : i < activeStage || !loading ? "lab-stage-done" : ""
              }`}
            >
              <div className="lab-stage-dot" />
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", letterSpacing: "0.06em" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {stage}
            </div>
          ))}
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div className="lab-answer">
          {answer.split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => (
            <p key={line} style={{ marginBottom: "0.75rem", color: "var(--muted)" }}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
