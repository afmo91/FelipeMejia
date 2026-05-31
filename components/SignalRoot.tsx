"use client";

import Link from "next/link";
import ChatEngine from "@/components/Signal/ChatEngine";

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
      <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fff", letterSpacing: 0 }}>
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
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background:
        "radial-gradient(circle at 72% 22%, rgba(34,211,238,0.13), transparent 32%), radial-gradient(circle at 26% 72%, rgba(139,92,246,0.16), transparent 34%), linear-gradient(160deg, #080712 0%, #080810 42%, #050b10 100%)",
      overflow: "hidden",
    }}>
      <TopBar />
      <ChatEngine />

      {/* Global styles for this experience */}
      <style>{`
        .signal-scene-area {
          position: absolute;
          top: 3.5rem;
          left: 0;
          right: 0;
          bottom: 0;
          transition: left 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        @media (min-width: 1024px) {
          .signal-scene-area {
            left: clamp(21rem, 38vw, 34rem);
          }
        }
      `}</style>
    </div>
  );
}
