"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ResolvedPath } from "@/lib/phrases";

type Section = "who" | "scope" | "method" | "proof" | "cv";

const PILL_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: "who",    icon: "👤", label: "Who" },
  { id: "scope",  icon: "📊", label: "Scope" },
  { id: "method", icon: "⚙️", label: "Method" },
  { id: "proof",  icon: "📈", label: "Proof" },
  { id: "cv",     icon: "📄", label: "CV" },
];

const PRINCIPLES = [
  { num: "01", text: "Signal first, then solution — I start by finding the data point worth acting on." },
  { num: "02", text: "Ship to learn, not to finish — every sprint ends with a decision, not just a deliverable." },
  { num: "03", text: "Instrumented from day one — if you can't measure it, you can't improve it." },
  { num: "04", text: "Decisions, not decks — the output is action, not a report that sits in a folder." },
];

const CASES = [
  {
    title: "AI Ads Operating Layer — Spotz.pro",
    problem: "Fragmented multi-channel campaign workflows with no unified view across Google, Meta, LinkedIn, TikTok, X and Pinterest",
    move: "Built 0→1 an AI-powered advertising platform that unified workflow, analytics and creative production",
    result: "Cross-channel observability and a scalable operating model for AI-driven campaign management",
  },
  {
    title: "Digital Onboarding — Adamo Telecom",
    problem: "Legacy activation process taking 5+ days, causing significant drop-off before customers reached the product",
    move: "Digitised the onboarding journey end-to-end, redesigning the activation flow around customer behaviour",
    result: "Activation time reduced from 5 days to same-day. €200K+ recovered through attribution improvements",
  },
];

function WhoSection() {
  return (
    <div>
      <p className="section-eyebrow">Profile</p>
      <h2 className="section-title">Felipe Mejia</h2>
      <p className="section-lead">Product & Growth Leader. AI systems builder. 12+ years from ambiguous brief to shipped outcome.</p>
      <div className="stat-grid">
        {[
          { v: "12+",   l: "Years experience" },
          { v: "€3M+",  l: "Performance budget managed" },
          { v: "0→1",   l: "Products built from scratch" },
          { v: "5×",    l: "Industries delivered in" },
        ].map(({ v, l }) => (
          <div key={v} className="stat-card">
            <div className="stat-value">{v}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
        {[
          { co: "Spotz.pro",      role: "Product Builder",        yr: "2025–2026" },
          { co: "Adamo Telecom",  role: "Growth Product Manager", yr: "2019–2025" },
        ].map(({ co, role, yr }) => (
          <div key={co} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.875rem 1rem", background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: "10px",
          }}>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9375rem" }}>{co}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "0.15rem" }}>{role}</div>
            </div>
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.06em" }}>{yr}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScopeSection() {
  return (
    <div>
      <p className="section-eyebrow">What I've Owned</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>Scope & ownership</h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
        I've owned strategy, delivery and results — not just advised. Here's the scope of what I've run.
      </p>
      <div className="principle-list">
        {[
          { num: "€3M+",      text: "Annual performance budget owned across Google, Meta, LinkedIn, TikTok, X and Pinterest" },
          { num: "C-level",   text: "Weekly decision dashboards delivered directly to leadership as primary input for strategy" },
          { num: "0→1",       text: "Built an AI-powered multi-channel advertising platform from concept to production at Spotz.pro" },
          { num: "Same-day",  text: "Reduced customer activation from a 5-day legacy process to same-day through digital onboarding redesign" },
          { num: "+25%",      text: "Conversion lift delivered through structured experimentation cadence and funnel instrumentation" },
        ].map(({ num, text }) => (
          <div key={num} className="principle-item">
            <span className="principle-num">{num}</span>
            <span className="principle-text">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodSection() {
  return (
    <div>
      <p className="section-eyebrow">How I Work</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>Four principles</h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
        Not a list of tools — a way of working that produces outcomes.
      </p>
      <div className="principle-list">
        {PRINCIPLES.map(({ num, text }) => (
          <div key={num} className="principle-item">
            <span className="principle-num">{num}</span>
            <span className="principle-text">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProofSection() {
  return (
    <div>
      <p className="section-eyebrow">Selected Work</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>Proof</h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
        Every case study answers the same question: what changed because of the work?
      </p>
      {CASES.map((c) => (
        <div key={c.title} className="case-card">
          <div className="case-title">{c.title}</div>
          <div className="case-row">
            <div><span className="case-row-label">Problem</span><span className="case-row-val">{c.problem}</span></div>
            <div><span className="case-row-label">Move</span><span className="case-row-val">{c.move}</span></div>
            <div><span className="case-row-label">Result</span><span className="case-row-val">{c.result}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CVSection({ context, cvHint }: { context: string; cvHint: string }) {
  const [summary, setSummary]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [variant, setVariant]   = useState("general");

  useEffect(() => {
    setLoading(true);
    const utmSource = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("utm_source") ?? undefined
      : undefined;
    fetch("/api/generate-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context, cvHint, utmSource }),
    })
      .then((r) => r.json())
      .then((d: { summary?: string; variant?: string }) => {
        setSummary(d.summary ?? null);
        setVariant(d.variant ?? "general");
      })
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [context, cvHint]);

  const pdfUrl = `/cv?variant=${variant}`;

  return (
    <div>
      <p className="section-eyebrow">CV</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>Tailored for your context</h2>
      <div className="cv-card">
        {loading ? (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
            <div className="routing-dots" style={{ transform: "scale(0.7)" }}>
              <div className="routing-dot" /><div className="routing-dot" /><div className="routing-dot" />
            </div>
            Generating your tailored brief…
          </div>
        ) : summary ? (
          <>
            <p className="cv-generated">{summary}</p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href={pdfUrl} className="hub-btn-primary" style={{ textDecoration: "none" }}>
                Download CV PDF ↓
              </a>
              <a href="https://linkedin.com/in/felipemejiagonzalez" target="_blank" rel="noopener" className="hub-btn-secondary" style={{ textDecoration: "none" }}>
                LinkedIn ↗
              </a>
            </div>
          </>
        ) : (
          <a href="/cv" className="hub-btn-primary" style={{ textDecoration: "none" }}>Download CV PDF ↓</a>
        )}
      </div>
    </div>
  );
}

export default function HiringPath({ path }: { path: ResolvedPath }) {
  const [active, setActive] = useState<Section>("who");

  return (
    <div className="hub-root">
      {/* Desktop sidebar */}
      <aside className="hub-sidebar hidden lg:flex">
        <div style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-geist-mono)", marginBottom: "1rem", padding: "0 0.875rem" }}>
          Hiring path
        </div>
        {PILL_ITEMS.map(({ id, icon, label }) => (
          <button key={id} className={`sidebar-item ${active === id ? "sidebar-item-active" : ""}`} onClick={() => setActive(id)}>
            <span className="sidebar-icon">{icon}</span>
            <span className="sidebar-label">{label}</span>
          </button>
        ))}
      </aside>

      {/* Content */}
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
            {active === "who"    && <WhoSection />}
            {active === "scope"  && <ScopeSection />}
            {active === "method" && <MethodSection />}
            {active === "proof"  && <ProofSection />}
            {active === "cv"     && <CVSection context={path.context} cvHint={path.cvHint} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile pill */}
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
