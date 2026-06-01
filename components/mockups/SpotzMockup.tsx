"use client";

import { motion } from "framer-motion";
import type { MockupProps } from "./types";
import { MockupShell, StatusChip, cn } from "./mockupUtils";

const channels = [
  { name: "Google", value: "42%", tone: "from-cyan-300/35 to-purple-400/20" },
  { name: "Meta", value: "28%", tone: "from-purple-300/35 to-cyan-400/20" },
  { name: "LinkedIn", value: "13%", tone: "from-sky-300/30 to-purple-400/20" },
  { name: "TikTok", value: "8%", tone: "from-cyan-200/25 to-fuchsia-400/20" },
  { name: "X", value: "5%", tone: "from-slate-200/25 to-cyan-300/15" },
  { name: "Pinterest", value: "4%", tone: "from-pink-300/25 to-purple-400/20" },
];

const recommendations = [
  ["Budget shift detected", "Move 12% from Meta to Google Search", "cyan"],
  ["CAC down", "Retain winning segment for 7 more days", "green"],
  ["Creative fatigue", "Refresh 3 static assets before spend lift", "purple"],
] as const;

export default function SpotzMockup({ className }: MockupProps) {
  return (
    <MockupShell className={className} eyebrow="Paid media OS" title="Spotz.pro operating layer">
      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[1.28fr_0.72fr]">
        <div className="grid min-h-0 gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {channels.map((channel, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-3"
                initial={{ opacity: 0, y: 10 }}
                key={channel.name}
                transition={{ delay: index * 0.045, duration: 0.4 }}
              >
                <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", channel.tone)} />
                <p className="text-xs font-medium text-white">{channel.name}</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="text-xl font-semibold text-white">{channel.value}</span>
                  <span className="text-[0.68rem] text-slate-400">allocation</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative min-h-[188px] overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/50">Cross-channel performance</p>
                <h4 className="mt-1 text-lg font-semibold text-white">Conversion trend</h4>
              </div>
              <StatusChip tone="green">CAC down</StatusChip>
            </div>

            <svg className="mt-5 h-28 w-full overflow-visible" fill="none" viewBox="0 0 520 140">
              <defs>
                <linearGradient id="spotzLine" x1="0" x2="520" y1="0" y2="0">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="spotzFill" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#22d3ee" stopOpacity="0.24" />
                  <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[28, 64, 100].map((y) => (
                <path d={`M0 ${y}H520`} key={y} stroke="rgba(255,255,255,.08)" strokeDasharray="4 8" />
              ))}
              <motion.path
                animate={{ pathLength: 1, opacity: 1 }}
                d="M0 104 C52 88 78 82 112 92 C158 105 180 64 226 70 C274 76 292 40 334 48 C390 58 408 26 452 36 C482 42 502 34 520 24"
                initial={{ pathLength: 0, opacity: 0.3 }}
                stroke="url(#spotzLine)"
                strokeLinecap="round"
                strokeWidth="4"
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
              <path
                d="M0 104 C52 88 78 82 112 92 C158 105 180 64 226 70 C274 76 292 40 334 48 C390 58 408 26 452 36 C482 42 502 34 520 24 V140 H0 Z"
                fill="url(#spotzFill)"
              />
            </svg>

            <div className="mt-1 grid gap-2 sm:grid-cols-2">
              <StatusChip>Budget allocation</StatusChip>
              <StatusChip tone="cyan">Conversion trend</StatusChip>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-300/15 bg-purple-400/[0.07] p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-purple-100/55">AI Recommendations</p>
              <h4 className="mt-1 text-base font-semibold text-white">Next best moves</h4>
            </div>
            <motion.span
              animate={{ boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 28px rgba(34,211,238,.24)", "0 0 0 rgba(34,211,238,0)"] }}
              className="h-2.5 w-2.5 rounded-full bg-cyan-300"
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>

          <div className="mt-4 grid gap-3">
            {recommendations.map(([label, copy, tone], index) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-white/10 bg-black/25 p-3"
                initial={{ opacity: 0, x: 12 }}
                key={label}
                transition={{ delay: 0.18 + index * 0.08, duration: 0.42 }}
              >
                <StatusChip tone={tone}>{label}</StatusChip>
                <p className="mt-3 text-sm leading-5 text-slate-200/82">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MockupShell>
  );
}
