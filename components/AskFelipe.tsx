"use client";

import { useEffect, useRef, useState } from "react";
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
  const [askedMessage, setAskedMessage] = useState<string | null>(null);
  const [answer, setAnswer] = useState<AskFelipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (asideRef.current && !asideRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
    setAskedMessage(nextMessage);
    setAnswer(null);
    setLoading(true);
    setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);

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

  function resetConversation() {
    setAskedMessage(null);
    setAnswer(null);
    setMessage(askFelipePrompts[0]);
  }

  function sendContext() {
    const brief = [`Ask Felipe context:`, message, "", answer?.answer || section.note].join("\n");
    window.dispatchEvent(new CustomEvent("prefill-contact-message", { detail: { message: brief } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <aside className="ask-felipe" aria-label="Ask Felipe assistant" ref={asideRef}>
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
          {/* Panel header — always visible */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="ask-felipe-note flex-1">
              <span>{section.label}</span>
              <p>{section.note}</p>
            </div>
            <button
              aria-label="Close Ask Felipe"
              className="flex-shrink-0 border border-white/10 bg-black/30 px-2 py-1 text-sm text-gray-400 hover:text-white transition"
              onClick={() => setOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>

          {/* COMPOSE VIEW — shown when no question has been asked yet */}
          {!askedMessage && (
            <>
              <div className="flex flex-wrap gap-2">
                {askFelipePrompts.map((prompt) => (
                  <button className="example-chip" key={prompt} onClick={() => askFelipe(prompt)} type="button">
                    {prompt}
                  </button>
                ))}
              </div>
              <form
                className="mt-4 grid gap-3"
                onSubmit={(e) => { e.preventDefault(); void askFelipe(); }}
              >
                <label className="sr-only" htmlFor="ask-felipe-input">
                  Ask Felipe about a product, growth, or AI workflow challenge
                </label>
                <textarea
                  className="form-field min-h-20 resize-y text-sm"
                  id="ask-felipe-input"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
                <button className="button-primary w-fit px-4 py-2 text-sm" type="submit">
                  Ask
                </button>
              </form>
            </>
          )}

          {/* CONVERSATION VIEW — shown after a question is submitted */}
          {askedMessage && (
            <div className="ask-felipe-thread" ref={answerRef} role="status">
              {/* User question bubble */}
              <div className="af-question">
                <span className="af-who">You</span>
                <p>{askedMessage}</p>
              </div>

              {/* Felipe answer */}
              <div className="af-answer">
                <span className="af-who af-who-felipe">Felipe</span>
                {loading ? (
                  <div className="af-loading">
                    <span /><span /><span />
                  </div>
                ) : answer ? (
                  <>
                    {formatAnswer(answer.answer).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    {answer.stages && answer.stages.length > 0 && (
                      <div className="af-stages">
                        {answer.stages.map((stage) => (
                          <span key={stage}>{stage}</span>
                        ))}
                      </div>
                    )}
                    <div className="af-actions">
                      <button className="af-action-primary" onClick={sendContext} type="button">
                        Send this context →
                      </button>
                      <button className="af-action-secondary" onClick={resetConversation} type="button">
                        Ask another
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </aside>
  );
}
