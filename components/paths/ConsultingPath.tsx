"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ResolvedPath } from "@/lib/phrases";
import LabSection from "@/components/sections/LabSection";

type Section = "problem" | "engagement" | "lab" | "results" | "start";

const PILL_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: "problem",    icon: "🔍", label: "Problem" },
  { id: "engagement", icon: "🗺️", label: "How" },
  { id: "lab",        icon: "⚗️", label: "Lab" },
  { id: "results",    icon: "📈", label: "Results" },
  { id: "start",      icon: "✉️", label: "Start" },
];

const DIAGNOSTIC_SIGNS = [
  "Your data team ships dashboards nobody acts on",
  "Growth is channel-dependent, not system-driven",
  "You have the AI tools but not the operating model",
  "Activation, retention or conversion is stuck",
  "Attribution is a guess, not an instrument",
  "Experimentation is ad hoc, not a cadence",
];

const ENGAGEMENT_MODES = [
  { title: "Clarity Sprint", meta: "1 week · Remote", desc: "Turn a fuzzy product idea or stuck workflow into a prioritised brief, user journey, metrics and first sprint. You leave with a scoped decision, not another backlog item." },
  { title: "Growth System Audit", meta: "2 weeks · Remote", desc: "Find funnel leaks, instrumentation gaps, attribution blind spots and the experiment cadence to fix them. Output is an actionable roadmap with ownership and sequence." },
  { title: "AI Workflow Build", meta: "4–6 weeks · Remote", desc: "Design and ship an AI-assisted workflow that classifies inputs, surfaces exceptions and feeds decisions back into dashboards. Includes instrumentation and a decision review cadence." },
];

const RESULTS = [
  { v: "5 days → same-day", l: "Activation time reduction through digital onboarding" },
  { v: "+25%",              l: "Conversion lift from structured experimentation cadence" },
  { v: "−30%",              l: "CAC reduction through sharper funnel execution" },
  { v: "€200K+",            l: "Recovered through attribution and spend reallocation" },
  { v: "€3M+",              l: "Annual performance budget managed across five channels" },
];

function ProblemSection() {
  return (
    <div>
      <p className="section-eyebrow">Does this sound familiar?</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>The problems I solve</h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
        I work best when there's a clear gap between data and decision — or between an idea and a shipped product.
      </p>
      <div className="principle-list">
        {DIAGNOSTIC_SIGNS.map((sign, i) => (
          <div key={sign} className="principle-item">
            <span className="principle-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="principle-text">{sign}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngagementSection() {
  return (
    <div>
      <p className="section-eyebrow">Three ways to engage</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>How I work</h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
        A good engagement ends with shipped decisions, not a heavier backlog.
      </p>
      {ENGAGEMENT_MODES.map(({ title, meta, desc }) => (
        <div key={title} className="mode-card">
          <div className="mode-title">{title}</div>
          <div className="mode-meta">{meta}</div>
          <div className="mode-desc">{desc}</div>
        </div>
      ))}
    </div>
  );
}

function ResultsSection() {
  return (
    <div>
      <p className="section-eyebrow">Commercial proof</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>Results</h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
        The point of instrumentation is not prettier charts — it is faster decisions and visible lift.
      </p>
      <div className="stat-grid">
        {RESULTS.map(({ v, l }) => (
          <div key={v} className="stat-card">
            <div className="stat-value" style={{ fontSize: "1.5rem" }}>{v}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StartSection({ context }: { context: string }) {
  const [msg, setMsg]       = useState(context ?? "");
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [loading, setLoad]  = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoad(true);
    // Use the existing contact mechanism — dispatch prefill event
    window.dispatchEvent(new CustomEvent("prefill-contact-message", { detail: { message: msg } }));
    // Simulate submission
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoad(false);
  }

  if (sent) {
    return (
      <div>
        <p className="section-eyebrow">Sent</p>
        <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2rem)" }}>Thanks — I'll be in touch.</h2>
        <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
          I read every message and reply within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="section-eyebrow">Map the opportunity</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>Start a conversation</h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
        Bring the messy version. The first job is to make the opportunity legible.
      </p>
      <form className="hub-form" onSubmit={submit}>
        <textarea
          className="hub-field"
          rows={4}
          placeholder="What's the challenge? What's stuck? What does success look like in 4 weeks?"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          style={{ minHeight: "6rem" }}
        />
        <input
          type="email"
          className="hub-field"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button type="submit" className="hub-btn-primary" disabled={loading}>
            {loading ? "Sending…" : "Send brief →"}
          </button>
          <a href="https://linkedin.com/in/felipemejiagonzalez" target="_blank" rel="noopener" className="hub-btn-secondary" style={{ textDecoration: "none" }}>
            Connect on LinkedIn ↗
          </a>
        </div>
      </form>
    </div>
  );
}

export default function ConsultingPath({ path }: { path: ResolvedPath }) {
  const [active, setActive] = useState<Section>("problem");

  return (
    <div className="hub-root">
      <aside className="hub-sidebar hidden lg:flex">
        <div style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-geist-mono)", marginBottom: "1rem", padding: "0 0.875rem" }}>
          Consulting path
        </div>
        {PILL_ITEMS.map(({ id, icon, label }) => (
          <button key={id} className={`sidebar-item ${active === id ? "sidebar-item-active" : ""}`} onClick={() => setActive(id)}>
            <span className="sidebar-icon">{icon}</span>
            <span className="sidebar-label">{label}</span>
          </button>
        ))}
      </aside>

      <div className="hub-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="hub-section"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
          >
            {active === "problem"    && <ProblemSection />}
            {active === "engagement" && <EngagementSection />}
            {active === "lab"        && <LabSection mode="consulting" context={path.context} />}
            {active === "results"    && <ResultsSection />}
            {active === "start"      && <StartSection context={path.context} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="path-pill lg:hidden" aria-label="Navigation">
        {PILL_ITEMS.map(({ id, icon, label }) => (
          <button key={id} className={`pill-item ${active === id ? "pill-item-active" : ""}`} onClick={() => setActive(id)}>
            <span className="pill-icon">{icon}</span>
            <span className="pill-label">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
