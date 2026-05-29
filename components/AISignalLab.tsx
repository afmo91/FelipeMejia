"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { AskFelipeResponse } from "@/lib/askFelipe";

const exampleInputs = [
  "We have a B2B SaaS onboarding funnel but users drop before activation.",
  "Our team uses spreadsheets to manage cross-channel campaigns and reporting.",
  "We want to add AI to customer operations, but we do not know where it creates real value.",
];

function answerLines(answer: string) {
  return answer.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

export default function AISignalLab({ sectionLabel }: { sectionLabel: string }) {
  const [message, setMessage] = useState(exampleInputs[0]);
  const [result, setResult] = useState<AskFelipeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function runDiagnostic(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ask-felipe", {
        body: JSON.stringify({ message, mode: "diagnostic", section: sectionLabel }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as AskFelipeResponse;
      setResult(data);
    } catch {
      setResult({
        answer:
          "Diagnosis: this is a product signal problem.\nMissing signals: activation, drop-off, ownership, and decision cadence.\nFirst sprint: map the workflow, instrument the key events, ship one focused experiment, and turn the result into a dashboard.",
        source: "fallback",
        stages: ["Understand request", "Find product signal", "Map workflow", "Suggest sprint", "Connect proof"],
      });
    } finally {
      setLoading(false);
    }
  }

  function sendToContact() {
    const brief = [`AI Signal Lab brief:`, message, "", result?.answer || ""].join("\n");
    window.dispatchEvent(new CustomEvent("prefill-contact-message", { detail: { message: brief } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="scan-lab" aria-label="AI Signal Lab interactive diagnostic">
      <div className="scan-lab-console">
        <div className="scan-lab-header">
          <span>AI Signal Agent</span>
          <span>{result?.source === "openai" ? "Live model" : "Demo mode"}</span>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={runDiagnostic}>
          <label className="sr-only" htmlFor="ai-signal-input">
            Describe a product, growth, or AI workflow challenge
          </label>
          <textarea
            className="form-field min-h-28 resize-y"
            id="ai-signal-input"
            onChange={(event) => setMessage(event.target.value)}
            value={message}
          />
          <button className="button-primary w-fit" disabled={loading} type="submit">
            {loading ? "Scanning signals" : "Run signal scan"}
          </button>
          <div className="flex flex-wrap gap-2">
            {exampleInputs.map((example) => (
              <button
                className="example-chip"
                key={example}
                onClick={() => setMessage(example)}
                type="button"
              >
                {example.split(" ").slice(0, 6).join(" ")}...
              </button>
            ))}
          </div>
        </form>
      </div>

      <div className="scan-output">
        <div className="scan-stage-list" aria-label="Agent workflow stages">
          {(result?.stages || ["Understand request", "Find product signal", "Map workflow", "Suggest sprint", "Connect proof"]).map(
            (stage, index) => (
              <div className={`scan-stage-step ${result || loading ? "scan-stage-step-active" : ""}`} key={stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{stage}</p>
              </div>
            ),
          )}
        </div>

        <div className="scan-answer" role="status">
          {loading ? (
            <p className="text-accent2">Reading the workflow, finding the first useful signal...</p>
          ) : result ? (
            <>
              {answerLines(result.answer).map((line) => (
                <p key={line}>{line}</p>
              ))}
              <button className="mt-5 text-sm text-accent transition hover:text-white" onClick={sendToContact} type="button">
                Send this context to Felipe
              </button>
            </>
          ) : (
            <p>
              The output becomes a compact product brief: diagnosis, missing signals, first sprint, AI layer, and the proof
              that matches the problem.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
