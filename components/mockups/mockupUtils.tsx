"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { MockupProps } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const hoverTilt = {
  rest: { rotateX: 0, rotateY: 0, y: 0 },
  hover: { rotateX: 1.5, rotateY: -1.5, y: -4 },
};

export function MockupShell({
  children,
  className,
  eyebrow,
  title,
}: MockupProps & {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div
      className={cn(
        "group relative isolate min-h-[420px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(9,9,18,0.96),rgba(11,18,28,0.9)_48%,rgba(21,12,35,0.9))] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.38)] outline outline-1 outline-white/[0.03] backdrop-blur-2xl sm:p-4",
        className,
      )}
      initial="rest"
      whileHover="hover"
      variants={hoverTilt}
      transition={{ damping: 28, stiffness: 220, type: "spring" }}
    >
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.24, 0.46, 0.24], x: [-10, 10, -10] }}
        className="absolute -left-16 top-6 h-32 w-[70%] -rotate-6 bg-[linear-gradient(90deg,rgba(139,92,246,0.22),transparent)] blur-3xl"
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.14, 0.34, 0.14], x: [12, -8, 12] }}
        className="absolute -bottom-12 right-0 h-36 w-[72%] rotate-6 bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.18))] blur-3xl"
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:44px_44px]"
      />

      <div className="relative z-10 flex h-full min-h-[392px] flex-col rounded-[18px] border border-white/10 bg-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.68rem] uppercase tracking-[0.18em] text-cyan-100/45">{eyebrow}</p>
              <h3 className="truncate text-sm font-semibold text-white sm:text-base">{title}</h3>
            </div>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[0.65rem] font-medium text-emerald-100/80">
            Live system
          </span>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

export function StatusChip({ children, tone = "purple" }: { children: ReactNode; tone?: "purple" | "cyan" | "green" }) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
      : tone === "green"
        ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
        : "border-purple-300/20 bg-purple-400/10 text-purple-100";

  return <span className={cn("rounded-full border px-2.5 py-1 text-[0.68rem] font-medium", toneClass)}>{children}</span>;
}

export function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
