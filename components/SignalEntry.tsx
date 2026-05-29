"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AB_TAGLINES, CHAT_SUGGESTIONS, getABVariant, type ABVariant, type ResolvedPath } from "@/lib/phrases";
import type { BustState } from "@/components/BustPortrait";
import HiringPath     from "@/components/paths/HiringPath";
import ConsultingPath from "@/components/paths/ConsultingPath";
import ExploringPath  from "@/components/paths/ExploringPath";

const BustPortrait = dynamic(() => import("@/components/BustPortrait"), { ssr: false });

type FlowState = "entry" | "routing" | "hub";

// ── Top bar ───────────────────────────────────────────────────────
function TopBar({ onBack, inHub }: { onBack: () => void; inHub: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "3.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.25rem",
        zIndex: 80,
        borderBottom: inHub ? "1px solid var(--border)" : "none",
        background: inHub ? "rgba(8,8,16,0.85)" : "transparent",
        backdropFilter: inHub ? "blur(16px)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {inHub && (
          <button
            onClick={onBack}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--muted)", fontSize: "0.875rem", padding: "0.25rem",
            }}
            aria-label="Back to entry"
          >
            ←
          </button>
        )}
        <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fff", letterSpacing: "-0.03em" }}>
          FM
        </span>
      </div>
      <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        {[
          { label: "Blog",    href: "/blog" },
          { label: "CV",      href: "/cv" },
          { label: "Contact", href: "/contact" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: "0.8125rem",
              color: "var(--muted)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--muted)")}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

// ── Routing overlay ───────────────────────────────────────────────
function RoutingOverlay({ message }: { message: string }) {
  return (
    <motion.div
      className="routing-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ fontSize: "0.8125rem", color: "var(--muted)", maxWidth: "20rem", textAlign: "center", lineHeight: 1.5 }}>
        "{message}"
      </div>
      <div className="routing-dots">
        <div className="routing-dot" />
        <div className="routing-dot" />
        <div className="routing-dot" />
      </div>
      <div className="routing-label">Mapping your context</div>
    </motion.div>
  );
}

// ── Chat input ────────────────────────────────────────────────────
function ChatInput({
  onSubmit,
  disabled,
}: {
  onSubmit: (msg: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function submit(msg: string) {
    const trimmed = msg.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(value);
    }
  }

  // Auto-resize textarea
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
  }

  return (
    <motion.div
      className="chat-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.2 }}
    >
      {/* Quick suggestions */}
      <div className="chat-chips">
        {CHAT_SUGGESTIONS.map((s) => (
          <button key={s} className="chat-chip" onClick={() => submit(s)} disabled={disabled}>
            {s}
          </button>
        ))}
      </div>

      {/* Text input */}
      <div className="chat-input-wrap">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Tell me what brings you here…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          disabled={disabled}
          rows={1}
          aria-label="Tell me what brings you here"
        />
        <button
          className="chat-send-btn"
          onClick={() => submit(value)}
          disabled={disabled || !value.trim()}
          aria-label="Send"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// ── Entry screen ──────────────────────────────────────────────────
function EntryScreen({
  abVariant,
  onSubmit,
  bustState,
  onAssembled,
  disabled,
}: {
  abVariant: ABVariant;
  onSubmit: (msg: string) => void;
  bustState: BustState;
  onAssembled: () => void;
  disabled: boolean;
}) {
  const tagline = AB_TAGLINES[abVariant];

  return (
    <>
      {/* 3D bust — fills screen */}
      <div className="entry-bust-area">
        <BustPortrait
          bustState={bustState}
          size="large"
          showPhrases
          onAssembled={onAssembled}
        />
      </div>

      {/* Bottom content — tagline + chat */}
      <div className="entry-content">
        <motion.p
          className="entry-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: bustState !== "assembling" ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        >
          {tagline}
        </motion.p>

        <AnimatePresence>
          {bustState !== "assembling" && (
            <ChatInput onSubmit={onSubmit} disabled={disabled} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ── Hub screen ────────────────────────────────────────────────────
function HubScreen({ path }: { path: ResolvedPath }) {
  return (
    <motion.div
      className="hub-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ position: "absolute", inset: 0, top: "3.25rem" }}
    >
      {/* Greeting banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          padding: "0.625rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          fontSize: "0.8125rem",
          color: "var(--muted)",
          background: "rgba(139,92,246,0.06)",
          fontStyle: "italic",
        }}
      >
        {path.greeting}
        {path.emphasis.length > 0 && (
          <span style={{ marginLeft: "0.75rem" }}>
            {path.emphasis.map((e) => (
              <span key={e} className="result-badge" style={{ marginLeft: "0.375rem" }}>{e}</span>
            ))}
          </span>
        )}
      </motion.div>

      {path.type === "hiring"     && <HiringPath     path={path} />}
      {path.type === "consulting" && <ConsultingPath  path={path} />}
      {path.type === "exploring"  && <ExploringPath   path={path} />}
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function SignalEntry() {
  const [flow, setFlow]           = useState<FlowState>("entry");
  const [bustState, setBust]      = useState<BustState>("assembling");
  const [path, setPath]           = useState<ResolvedPath | null>(null);
  const [abVariant, setAB]        = useState<ABVariant>(0);
  const routingMsgRef             = useRef("");

  // Pick A/B variant on mount
  useEffect(() => { setAB(getABVariant()); }, []);

  function handleAssembled() {
    setBust("idle");
  }

  async function handleSubmit(message: string) {
    if (flow !== "entry") return;
    routingMsgRef.current = message;
    setBust("thinking");
    setFlow("routing");

    // Minimum 2.5s deliberate routing feel
    const [result] = await Promise.all([
      fetch("/api/route-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
        .then((r) => r.json())
        .then((d) => d as ResolvedPath)
        .catch((): ResolvedPath => ({
          type: "exploring",
          context: message,
          emphasis: [],
          greeting: "Take a look around — start wherever feels relevant.",
          cvHint: "general",
        })),
      new Promise((r) => setTimeout(r, 2600)),
    ]);

    setPath(result);
    setBust("active");
    setFlow("hub");
  }

  function handleBack() {
    setFlow("entry");
    setPath(null);
    setBust("idle");
  }

  return (
    <div className="signal-root">
      <TopBar onBack={handleBack} inHub={flow === "hub"} />

      {/* Subtle ambient background */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(139,92,246,0.06), transparent)",
        }}
      />

      <AnimatePresence mode="wait">
        {flow === "entry" && (
          <motion.div
            key="entry"
            style={{ position: "absolute", inset: 0, zIndex: 10 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EntryScreen
              abVariant={abVariant}
              onSubmit={handleSubmit}
              bustState={bustState}
              onAssembled={handleAssembled}
              disabled={flow !== "entry"}
            />
          </motion.div>
        )}

        {flow === "routing" && (
          <motion.div
            key="routing"
            style={{ position: "absolute", inset: 0, zIndex: 10 }}
          >
            {/* Keep bust visible in background during routing */}
            <div style={{ position: "absolute", inset: 0 }}>
              <BustPortrait bustState="thinking" size="large" showPhrases={false} />
            </div>
            <RoutingOverlay message={routingMsgRef.current} />
          </motion.div>
        )}

        {flow === "hub" && path && (
          <motion.div
            key="hub"
            style={{ position: "absolute", inset: 0, zIndex: 10 }}
          >
            <HubScreen path={path} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
