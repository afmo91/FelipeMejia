"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/conversation";

type Props = {
  messages: Message[];
  suggestions: string[];
  onSend: (text: string) => void;
  isLoading: boolean;
  audioEnabled: boolean | null;
};

// ── Single message bubble ─────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isFelipe = msg.role === "felipe";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isFelipe ? "flex-start" : "flex-end",
        marginBottom: "0.875rem",
      }}
    >
      {isFelipe && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem",
        }}>
          {/* Avatar dot */}
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
            flexShrink: 0, boxShadow: "0 0 8px rgba(139,92,246,0.5)",
          }} />
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(34,211,238,0.7)", fontFamily: "var(--font-geist-mono)" }}>
            Felipe
          </span>
        </div>
      )}
      <div style={{
        maxWidth: "88%",
        padding: isFelipe ? "0.625rem 0.875rem" : "0.5rem 0.875rem",
        background: isFelipe
          ? "rgba(255,255,255,0.05)"
          : "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(34,211,238,0.15))",
        border: isFelipe
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(139,92,246,0.3)",
        borderRadius: isFelipe ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
        backdropFilter: "blur(12px)",
      }}>
        <p style={{
          fontSize: "0.9rem",
          color: isFelipe ? "rgba(240,240,248,0.9)" : "#fff",
          lineHeight: 1.55,
          margin: 0,
          fontFamily: "var(--font-geist), system-ui, sans-serif",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}>
          {msg.text || " "}
          {/* Blinking cursor while text streams */}
          {isFelipe && msg.text.length > 0 && msg.text.length < 3 && (
            <span style={{ display: "inline-block", width: "2px", height: "0.85em", background: "#22d3ee", marginLeft: "2px", verticalAlign: "middle", animation: "chat-cursor 0.7s step-end infinite" }} />
          )}
        </p>
        {/* Action links */}
        {msg.action === "show_cv" && (
          <div style={{ marginTop: "0.625rem", paddingTop: "0.625rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <a href="/cv" style={{ fontSize: "0.8rem", color: "rgba(34,211,238,0.85)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              Download CV →
            </a>
          </div>
        )}
        {msg.action === "show_contact" && (
          <div style={{ marginTop: "0.625rem", paddingTop: "0.625rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <a href="https://linkedin.com/in/felipemejiagonzalez" target="_blank" rel="noopener"
              style={{ fontSize: "0.8rem", color: "rgba(34,211,238,0.85)", textDecoration: "none", marginRight: "1rem" }}>
              LinkedIn ↗
            </a>
            <a href="/contact" style={{ fontSize: "0.8rem", color: "rgba(139,92,246,0.85)", textDecoration: "none" }}>
              Send a message →
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}
    >
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #22d3ee)", flexShrink: 0 }} />
      <div style={{
        padding: "0.5rem 0.875rem",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "4px 14px 14px 14px",
        display: "flex", gap: "4px", alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "rgba(34,211,238,0.7)",
            display: "inline-block",
            animation: `chat-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Suggestion chips ──────────────────────────────────────────────
function Suggestions({ items, onSelect, disabled }: {
  items: string[];
  onSelect: (t: string) => void;
  disabled: boolean;
}) {
  if (!items.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
      style={{
        display: "flex", flexWrap: "wrap", gap: "0.4rem",
        padding: "0.5rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {items.map((s) => (
        <button
          key={s}
          disabled={disabled}
          onClick={() => !disabled && onSelect(s)}
          style={{
            padding: "0.35rem 0.75rem",
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.28)",
            borderRadius: "999px",
            fontSize: "0.78rem",
            color: disabled ? "rgba(240,240,248,0.35)" : "rgba(240,240,248,0.88)",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.15s",
            fontFamily: "var(--font-geist), system-ui, sans-serif",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!disabled) (e.currentTarget.style.background = "rgba(139,92,246,0.22)");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.style.background = "rgba(139,92,246,0.1)");
          }}
        >
          {s}
        </button>
      ))}
    </motion.div>
  );
}

// ── Input row ─────────────────────────────────────────────────────
function InputRow({ onSend, disabled }: { onSend: (t: string) => void; disabled: boolean }) {
  const [val, setVal] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const t = val.trim();
    if (!t || disabled) return;
    onSend(t);
    setVal("");
    if (ref.current) { ref.current.style.height = "auto"; }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setVal(e.target.value);
    if (ref.current) { ref.current.style.height = "auto"; ref.current.style.height = ref.current.scrollHeight + "px"; }
  }

  return (
    <div style={{
      display: "flex", gap: "0.5rem", alignItems: "flex-end",
      padding: "0.625rem 0.75rem",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <textarea
        ref={ref}
        value={val}
        onChange={onChange}
        onKeyDown={onKey}
        disabled={disabled}
        rows={1}
        placeholder="Ask anything…"
        style={{
          flex: 1, background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px",
          padding: "0.5rem 0.75rem", color: "rgba(240,240,248,0.9)",
          fontSize: "0.875rem", fontFamily: "var(--font-geist), system-ui, sans-serif",
          outline: "none", resize: "none", minHeight: "2.25rem", maxHeight: "7rem",
          lineHeight: 1.5,
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.45)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
      />
      <button
        onClick={submit}
        disabled={disabled || !val.trim()}
        aria-label="Send"
        style={{
          width: "2.1rem", height: "2.1rem", borderRadius: "8px",
          background: disabled || !val.trim() ? "rgba(139,92,246,0.25)" : "#8b5cf6",
          border: "none", cursor: disabled || !val.trim() ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "background 0.15s",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h12M7 1l6 6-6 6" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Chat thread ────────────────────────────────────────────────────
function Thread({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "1rem 0.75rem 0.5rem",
      scrollbarWidth: "none",
    }}>
      <style>{`
        .chat-thread-inner::-webkit-scrollbar { display: none; }
        @keyframes chat-dot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        @keyframes chat-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
      {messages.map((m) => <Bubble key={m.id} msg={m} />)}
      <AnimatePresence>
        {isLoading && <TypingIndicator key="typing" />}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}

// ── Audio indicator ────────────────────────────────────────────────
function AudioBadge({ enabled }: { enabled: boolean | null }) {
  if (enabled === null) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.35rem",
      padding: "0.2rem 0.6rem", borderRadius: "999px",
      background: enabled ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.05)",
      border: `1px solid ${enabled ? "rgba(34,211,238,0.25)" : "rgba(255,255,255,0.08)"}`,
      fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase",
      color: enabled ? "rgba(34,211,238,0.8)" : "rgba(240,240,248,0.4)",
      fontFamily: "var(--font-geist-mono), monospace",
    }}>
      {enabled ? "🔊" : "🔇"} {enabled ? "Audio on" : "Audio off"}
    </div>
  );
}

// ── Mobile bottom sheet ────────────────────────────────────────────
function MobilePanel(props: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 30, delay: 0.3 }}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        zIndex: 60,
        background: "rgba(8,8,16,0.92)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "none",
        borderRadius: "18px 18px 0 0",
        display: "flex", flexDirection: "column",
        height: expanded ? "78vh" : "46vh",
        transition: "height 0.35s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.08)",
      }}
    >
      {/* Handle + header */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.625rem 0.875rem 0.375rem",
          cursor: "pointer", flexShrink: 0,
        }}
      >
        <div style={{ width: "2.5rem", height: "3px", borderRadius: "99px", background: "rgba(255,255,255,0.18)", margin: "0 auto 0.25rem" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0.875rem 0.5rem", flexShrink: 0 }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(139,92,246,0.7)", fontFamily: "var(--font-geist-mono)" }}>
          Felipe Mejia
        </span>
        <AudioBadge enabled={props.audioEnabled} />
      </div>

      <Thread messages={props.messages} isLoading={props.isLoading} />
      <Suggestions items={props.suggestions} onSelect={props.onSend} disabled={props.isLoading} />
      <InputRow onSend={props.onSend} disabled={props.isLoading} />
    </motion.div>
  );
}

// ── Desktop left panel ─────────────────────────────────────────────
function DesktopPanel(props: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, delay: 0.2 }}
      style={{
        position: "fixed", top: "3.5rem", left: 0, bottom: 0,
        width: "38%", maxWidth: "420px",
        zIndex: 50,
        background: "rgba(8,8,16,0.88)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column",
        boxShadow: "4px 0 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 1.125rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
            boxShadow: "0 0 12px rgba(139,92,246,0.5)",
          }} />
          <div>
            <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "#fff" }}>Felipe Mejia</div>
            <div style={{ fontSize: "0.6rem", color: "rgba(34,211,238,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-geist-mono)" }}>
              Product · Growth · AI
            </div>
          </div>
        </div>
        <AudioBadge enabled={props.audioEnabled} />
      </div>

      <Thread messages={props.messages} isLoading={props.isLoading} />
      <Suggestions items={props.suggestions} onSelect={props.onSend} disabled={props.isLoading} />
      <InputRow onSend={props.onSend} disabled={props.isLoading} />
    </motion.div>
  );
}

// ── Main export ────────────────────────────────────────────────────
export default function ChatPanel(props: Props) {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <MobilePanel {...props} /> : <DesktopPanel {...props} />;
}
