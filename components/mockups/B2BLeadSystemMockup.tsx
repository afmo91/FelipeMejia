"use client";

import { motion } from "framer-motion";
import type { MockupProps } from "./types";
import { MockupShell, StatusChip } from "./mockupUtils";

const products = ["Industrial films", "Custom packaging", "Food-grade rolls"];
const pipeline = [
  ["New", "WhatsApp lead", "3"],
  ["Qualified", "Qualified request", "2"],
  ["Quoted", "CRM pipeline", "1"],
];
const taxonomy = ["Material", "Thickness", "Industry", "Format", "MOQ"];

export default function B2BLeadSystemMockup({ className }: MockupProps) {
  return (
    <MockupShell className={className} eyebrow="B2B acquisition" title="Lead system workspace">
      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">Product selector</p>
              <StatusChip tone="cyan">CMS taxonomy</StatusChip>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {products.map((product, index) => (
                <motion.button
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-left transition group-hover:border-white/15"
                  initial={{ opacity: 0, y: 8 }}
                  key={product}
                  transition={{ delay: index * 0.08, duration: 0.36 }}
                  type="button"
                >
                  <span className="block h-16 rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(139,92,246,.22),rgba(34,211,238,.1))]" />
                  <span className="mt-3 block text-sm font-semibold text-white">{product}</span>
                  <span className="mt-1 block text-[0.68rem] text-slate-400">Select and qualify</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.055] p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-100/55">WhatsApp lead</p>
                <h4 className="mt-1 text-base font-semibold text-white">Qualified request</h4>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-sm font-semibold text-emerald-100">
                WA
              </span>
            </div>
            <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-black/25 p-3">
              <p className="text-sm leading-5 text-slate-100">"Need 2,000 units for food packaging. Can you quote delivery to Lyon?"</p>
              <div className="flex flex-wrap gap-2">
                <StatusChip tone="green">Product matched</StatusChip>
                <StatusChip tone="cyan">Routed to sales</StatusChip>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Internal lead board</p>
              <StatusChip>CRM pipeline</StatusChip>
            </div>
            <div className="mt-3 grid gap-2">
              {pipeline.map(([stage, label, count], index) => (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border border-white/10 bg-black/25 p-3"
                  initial={{ opacity: 0, x: 12 }}
                  key={stage}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.36 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{stage}</span>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-xs text-cyan-100">{count}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <p className="text-sm font-semibold text-white">CMS product taxonomy panel</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {taxonomy.map((item) => (
                <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-slate-200" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <motion.div
              animate={{ scaleX: 1 }}
              className="mt-4 h-2 rounded-full bg-[linear-gradient(90deg,#8b5cf6,#22d3ee,#34d399)]"
              initial={{ scaleX: 0.25 }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </MockupShell>
  );
}
