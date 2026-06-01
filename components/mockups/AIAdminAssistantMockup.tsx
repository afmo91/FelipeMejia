"use client";

import { motion } from "framer-motion";
import type { MockupProps } from "./types";
import { MiniMetric, MockupShell, StatusChip } from "./mockupUtils";

const checklist = ["Identity proof", "Address record", "Income statement", "Signed attestation"];
const context = [
  ["Profile", "French resident"],
  ["Need", "Housing file"],
  ["Language", "English -> French"],
  ["Deadline", "Friday"],
];

export default function AIAdminAssistantMockup({ className }: MockupProps) {
  return (
    <MockupShell className={className} eyebrow="Internal copilot" title="AI admin assistant">
      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[0.92fr_1.15fr_0.72fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/50">Context</p>
          <div className="mt-3 grid gap-2">
            {context.map(([label, value]) => (
              <div className="rounded-xl border border-white/10 bg-black/25 p-2.5" key={label}>
                <p className="text-[0.66rem] uppercase tracking-[0.13em] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <StatusChip>Missing information detected</StatusChip>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Assistant</p>
              <StatusChip tone="cyan">Checklist generated</StatusChip>
            </div>
            <div className="grid gap-2.5">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mr-8 rounded-[6px_16px_16px_16px] border border-purple-300/15 bg-purple-400/10 p-3"
                initial={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-sm leading-5 text-slate-100">What document do you need?</p>
              </motion.div>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="ml-10 rounded-[16px_6px_16px_16px] border border-cyan-300/15 bg-cyan-300/10 p-3"
                initial={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.16, duration: 0.35 }}
              >
                <p className="text-sm leading-5 text-slate-100">A housing attestation for a rental application.</p>
              </motion.div>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mr-6 rounded-[6px_16px_16px_16px] border border-white/10 bg-white/[0.055] p-3"
                initial={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.32, duration: 0.35 }}
              >
                <p className="text-sm leading-5 text-slate-100">Draft ready for review. I still need the landlord name and lease start date.</p>
              </motion.div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Document checklist panel</p>
            <div className="mt-3 grid gap-2">
              {checklist.map((item, index) => (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-2"
                  initial={{ opacity: 0, x: -8 }}
                  key={item}
                  transition={{ delay: 0.16 + index * 0.08, duration: 0.35 }}
                >
                  <span className="text-sm text-slate-200">{item}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${index < 2 ? "bg-emerald-300" : "bg-purple-300"}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.035))] p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Generated preview</p>
            <StatusChip tone="green">Draft ready</StatusChip>
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-slate-100 p-3 text-slate-950 shadow-[0_20px_44px_rgba(0,0,0,0.32)]">
            <div className="h-2 w-24 rounded bg-slate-900/80" />
            <div className="mt-5 grid gap-2">
              <div className="h-1.5 rounded bg-slate-400/70" />
              <div className="h-1.5 rounded bg-slate-400/70" />
              <div className="h-1.5 w-4/5 rounded bg-slate-400/70" />
            </div>
            <div className="mt-5 rounded-lg border border-slate-300 p-2">
              <div className="h-1.5 rounded bg-slate-300" />
              <div className="mt-2 h-1.5 w-2/3 rounded bg-slate-300" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniMetric label="Steps" value="4/6" />
            <MiniMetric label="Risk" value="Low" />
          </div>
        </div>
      </div>
    </MockupShell>
  );
}
