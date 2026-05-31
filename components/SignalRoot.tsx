"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useConversation } from "@/components/Signal/ConversationEngine";
import ChatPanel from "@/components/Signal/ChatPanel";

const BustScene = dynamic(() => import("@/components/Signal/BustScene"), { ssr: false });

// ── Top bar ───────────────────────────────────────────────────────
function TopBar() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "3.5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 1.25rem",
      zIndex: 80,
      background: "rgba(8,8,16,0.7)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fff", letterSpacing: "-0.03em" }}>
        FM
      </span>
      <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        {[
          { label: "Blog",    href: "/blog" },
          { label: "CV",      href: "/cv" },
          { label: "Contact", href: "/contact" },
        ].map(({ label, href }) => (
          <Link key={href} href={href} style={{
            fontSize: "0.8125rem", color: "rgba(240,240,248,0.5)",
            textDecoration: "none", transition: "color 0.15s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,240,248,0.5)"; }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function SignalRoot() {
  const conv = useConversation();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "linear-gradient(160deg, #0a0812 0%, #080810 40%, #060a10 100%)",
      overflow: "hidden",
    }}>
      <TopBar />

      {/* 3D scene — bust + shapes — fills the screen (right portion on desktop) */}
      <div style={{
        position: "absolute",
        top: "3.5rem",
        left: 0,
        right: 0,
        bottom: 0,
        // On desktop shift right to make room for the chat panel
      }}
        className="bust-scene-area"
      >
        <BustScene
          bustState={conv.bustState}
          topic={conv.topic}
          amplitudeRef={conv.amplitudeRef}
          onAssembled={conv.handleAssembled}
        />
      </div>

      {/* Chat panel — overlays bottom (mobile) or left (desktop) */}
      <ChatPanel
        messages={conv.messages}
        suggestions={conv.suggestions}
        onSend={conv.sendMessage}
        isLoading={conv.isLoading}
        audioEnabled={conv.audioEnabled}
      />

      {/* Global styles for this experience */}
      <style>{`
        .bust-scene-area {
          transition: left 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        @media (min-width: 1024px) {
          .bust-scene-area {
            left: min(38%, 420px);
          }
        }
      `}</style>
    </div>
  );
}
