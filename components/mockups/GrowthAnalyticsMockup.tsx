"use client";

import { motion } from "framer-motion";
import type { MockupProps } from "./types";
import { MiniMetric, MockupShell, StatusChip } from "./mockupUtils";

const experiments = [
  ["Landing page test", "+11.8%", "Ship"],
  ["Offer framing", "+6.4%", "Keep"],
  ["Audience split", "-2.1%", "Stop"],
];

export default function GrowthAnalyticsMockup({ className }: MockupProps) {
  return (
    <MockupShell className={className} eyebrow="Growth control" title="Acquisition analytics">
      <div className="grid min-h-0 flex-1 gap-3 p-3 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="grid gap-3">
          <div className="grid grid-cols-3 gap-2">
            <MiniMetric label="Conversion" value="+25%" />
            <MiniMetric label="CAC" value="-30%" />
            <MiniMetric label="Recovered" value="€200K+" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Funnel chart</p>
              <StatusChip tone="green">Experiment velocity</StatusChip>
            </div>
            <div className="grid gap-2">
              {[
                ["Visit", "100%", "w-full"],
                ["Lead", "48%", "w-[74%]"],
                ["Qualified", "31%", "w-[58%]"],
                ["Customer", "12%", "w-[38%]"],
              ].map(([label, value, width], index) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-[0.7rem] text-slate-400">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-7 rounded-lg border border-white/10 bg-white/[0.035] p-1">
                    <motion.div
                      animate={{ scaleX: 1 }}
                      className={`${width} h-full rounded-md bg-[linear-gradient(90deg,rgba(139,92,246,.85),rgba(34,211,238,.76))]`}
                      initial={{ scaleX: 0.18 }}
                      style={{ transformOrigin: "left" }}
                      transition={{ delay: index * 0.12, duration: 0.7 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Attribution model</p>
              <StatusChip tone="cyan">ROAS control</StatusChip>
            </div>
            <svg className="mt-3 h-28 w-full overflow-visible" fill="none" viewBox="0 0 520 138">
              <defs>
                <linearGradient id="growthFlow" x1="0" x2="1" y1="0" y2="0">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              {["Search", "Social", "CRM", "Revenue"].map((label, index) => {
                const x = 22 + index * 154;
                return (
                  <g key={label}>
                    <rect fill="rgba(255,255,255,.055)" height="56" rx="16" stroke="rgba(255,255,255,.11)" width="106" x={x} y={42} />
                    <text fill="rgba(255,255,255,.82)" fontSize="13" fontWeight="600" x={x + 18} y="75">
                      {label}
                    </text>
                  </g>
                );
              })}
              <motion.path
                animate={{ pathLength: 1 }}
                d="M128 70 C174 30 210 30 246 70 S340 110 382 70 S454 38 484 70"
                initial={{ pathLength: 0 }}
                stroke="url(#growthFlow)"
                strokeLinecap="round"
                strokeWidth="3"
                transition={{ duration: 1.9, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Experiment table</p>
              <StatusChip>Landing page test</StatusChip>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
              {experiments.map(([name, lift, action], index) => (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-[1fr_72px_64px] border-b border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm last:border-b-0"
                  initial={{ opacity: 0, x: 10 }}
                  key={name}
                  transition={{ delay: 0.12 + index * 0.08, duration: 0.35 }}
                >
                  <span className="truncate text-slate-200">{name}</span>
                  <span className={lift.startsWith("+") ? "text-emerald-200" : "text-slate-400"}>{lift}</span>
                  <span className="text-cyan-100/70">{action}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}
