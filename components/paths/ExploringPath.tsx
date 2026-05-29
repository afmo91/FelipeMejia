"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ResolvedPath } from "@/lib/phrases";
import LabSection from "@/components/sections/LabSection";

type Section = "story" | "lab" | "work" | "connect";

const PILL_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: "story",   icon: "📖", label: "Story" },
  { id: "lab",     icon: "⚗️", label: "Lab" },
  { id: "work",    icon: "🗂️", label: "Work" },
  { id: "connect", icon: "✉️", label: "Connect" },
];

const WORK_ITEMS = [
  { title: "AI Ads Operating Layer", result: "Cross-channel observability at Spotz.pro", tag: "AI · 0→1" },
  { title: "Digital Onboarding",     result: "5 days → same-day activation",             tag: "Product · Telecom" },
  { title: "Attribution Model",      result: "€200K+ spend recovered",                   tag: "Analytics · Growth" },
  { title: "Experimentation Engine", result: "+25% CVR · −30% CAC",                      tag: "Growth · PLG" },
];

function StorySection() {
  return (
    <div>
      <p className="section-eyebrow">Background</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>The thread</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "38rem" }}>
        {[
          {
            yr: "Now",
            text: "Building Spotz.pro — an AI-powered multi-channel advertising platform — from zero to production. Designing the AI layer that connects creative, targeting, analytics and budget allocation into one operating model.",
          },
          {
            yr: "2019–2025",
            text: "At Adamo Telecom as Growth Product Manager. Digitised onboarding, unified customer data, built attribution, created weekly C-level dashboards. Took a 5-day activation process to same-day. Managed €3M+ in annual performance budget.",
          },
          {
            yr: "Before",
            text: "12+ years across telecoms, e-commerce and SaaS. Always the person who connects the messy data problem to the shipped product — and makes sure the instrumentation exists to know whether it worked.",
          },
          {
            yr: "Always",
            text: "Obsessed with the gap between data and decision. I build the systems, the workflows and the products that close it.",
          },
        ].map(({ yr, text }) => (
          <div key={yr} style={{ display: "flex", gap: "1rem" }}>
            <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.06em", paddingTop: "0.15rem", flexShrink: 0, width: "3rem" }}>{yr}</div>
            <p style={{ fontSize: "0.9375rem", color: "var(--muted)", lineHeight: 1.65 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkSection() {
  return (
    <div>
      <p className="section-eyebrow">Selected Work</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>Four engagements</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {WORK_ITEMS.map(({ title, result, tag }) => (
          <div key={title} className="case-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
            <div>
              <div className="case-title" style={{ marginBottom: "0.375rem" }}>{title}</div>
              <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>{result}</div>
            </div>
            <span className="result-badge" style={{ flexShrink: 0 }}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectSection() {
  return (
    <div>
      <p className="section-eyebrow">Say hello</p>
      <h2 className="section-title" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>Connect</h2>
      <p className="section-lead" style={{ fontSize: "0.9375rem" }}>
        No pitch, no agenda. If something resonated — reach out.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "20rem" }}>
        <a href="https://linkedin.com/in/felipemejiagonzalez" target="_blank" rel="noopener" className="hub-btn-primary" style={{ textDecoration: "none" }}>
          LinkedIn ↗
        </a>
        <a href="/contact" className="hub-btn-secondary" style={{ textDecoration: "none" }}>
          Send a message
        </a>
      </div>
    </div>
  );
}

export default function ExploringPath({ path }: { path: ResolvedPath }) {
  const [active, setActive] = useState<Section>("story");

  return (
    <div className="hub-root">
      <aside className="hub-sidebar hidden lg:flex">
        <div style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-geist-mono)", marginBottom: "1rem", padding: "0 0.875rem" }}>
          Exploring
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
            {active === "story"   && <StorySection />}
            {active === "lab"     && <LabSection mode="general" context={path.context} />}
            {active === "work"    && <WorkSection />}
            {active === "connect" && <ConnectSection />}
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
