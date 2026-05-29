"use client";

import { useEffect, useState } from "react";
import { askFelipePrompts, type AskFelipeResponse } from "@/lib/askFelipe";

type CompanionSection = {
  id: string;
  label: string;
  note: string;
};

const defaultSection: CompanionSection = {
  id: "home",
  label: "What I Do",
  note: "Start with the messy system, then find the first signal worth shipping around.",
};

function formatAnswer(answer: string) {
  return answer.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

export default function AskFelipe() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<CompanionSection>(defaultSection);
  const [message, setMessage] = useState(askFelipePrompts[0]);
  const [answer, setAnswer] = useState<AskFelipeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleSectionChange(event: Event) {
      const detail = (event as CustomEvent<CompanionSection>).detail;
      if (detail?.label) {
        setSection(detail);
      }
    }

    window.addEventListener("signal-section-change", handleSectionChange);
    return () => window.removeEventListener("signal-section-change", handleSectionChange);
  }, []);

  async function askFelipe(nextMessage = message) {
    setOpen(true);
    setMessage(nextMessage);
    setLoading(true);

    try {
      const response = await fetch("/api/ask-felipe", {
        body: JSON.stringify({ message: nextMessage, mode: "chat", section: section.label }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      setAnswer((await response.json()) as AskFelipeResponse);
    } catch {
      setAnswer({
        answer:
          "I would start by identifying the user outcome, the missing signal, and the smallest workflow we can ship to learn. Then we turn that into a two-week sprint with instrumentation, one experiment, and a clear decision review.",
        source: "fallback",
        stages: ["Understand request", "Find product signal", "Map workflow", "Suggest sprint", "Connect proof"],
      });
    } finally {
      setLoading(false);
    }
  }

  function sendContext() {
    const brief = [`Ask Felipe context:`, message, "", answer?.answer || section.note].join("\n");
    window.dispatchEvent(new CustomEvent("prefill-contact-message", { detail: { message: brief } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <aside className="ask-felipe" aria-label="Ask Felipe assistant">
      <button
        aria-expanded={open}
        className="ask-felipe-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>Ask Felipe</span>
        <small>{section.label}</small>
      </button>

      {open ? (
        <div className="ask-felipe-panel">
          <div className="ask-felipe-note">
            <span>{section.label}</span>
            <p>{section.note}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {askFelipePrompts.map((prompt) => (
              <button className="example-chip" key={prompt} onClick={() => askFelipe(prompt)} type="button">
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void askFelipe();
            }}
          >
            <label className="sr-only" htmlFor="ask-felipe-input">
              Ask Felipe about a product, growth, or AI workflow challenge
            </label>
            <textarea
              className="form-field min-h-24 resize-y text-sm"
              id="ask-felipe-input"
              onChange={(event) => setMessage(event.target.value)}
              value={message}
            />
            <button className="button-primary w-fit px-4 py-2 text-sm" disabled={loading} type="submit">
              {loading ? "Thinking" : "Ask"}
            </button>
          </form>

          <div className="ask-felipe-answer" role="status">
            {loading ? (
              <p>Mapping the request to a product signal...</p>
            ) : answer ? (
              <>
                {formatAnswer(answer.answer).map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <button className="mt-4 text-sm text-accent transition hover:text-white" onClick={sendContext} type="button">
                  Send this context
                </button>
              </>
            ) : (
              <p>Ask about AI workflows, onboarding, growth systems, analytics, pricing tests, or a first sprint.</p>
            )}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
