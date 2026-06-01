"use client";

import { motion } from "framer-motion";
import type { MockupProps } from "./types";
import { MockupShell, StatusChip } from "./mockupUtils";

const nodes = [
  { label: "Lead captured", x: 8, y: 26 },
  { label: "Enrich company", x: 34, y: 18 },
  { label: "Score intent", x: 62, y: 27 },
  { label: "Create CRM deal", x: 18, y: 64 },
  { label: "Draft outreach", x: 48, y: 70 },
  { label: "Schedule follow-up", x: 76, y: 60 },
];

const apiLabels = ["Gmail", "CRM", "Notion", "WhatsApp", "Google Drive"];

export default function WorkflowAutomationMockup({ className }: MockupProps) {
  return (
    <MockupShell className={className} eyebrow="Automation system" title="Agentic workflow">
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip tone="cyan">Agentic workflow</StatusChip>
          <StatusChip>Human approval step</StatusChip>
          <StatusChip tone="green">CRM updated</StatusChip>
          <StatusChip tone="cyan">Follow-up queued</StatusChip>
        </div>

        <div className="relative min-h-[290px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="workflowLine" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
              <filter id="workflowGlow">
                <feGaussianBlur result="coloredBlur" stdDeviation="1.7" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              animate={{ pathLength: 1 }}
              d="M14 34 C22 24 26 23 40 25 S57 25 66 34 C74 42 48 51 24 69 C34 74 44 76 52 76 S70 70 82 66"
              fill="none"
              filter="url(#workflowGlow)"
              initial={{ pathLength: 0 }}
              stroke="url(#workflowLine)"
              strokeLinecap="round"
              strokeWidth="0.9"
              transition={{ duration: 2.1, ease: "easeInOut" }}
            />
          </svg>

          {nodes.map((node, index) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="absolute w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035))] p-2.5 shadow-[0_16px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.92 }}
              key={node.label}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              transition={{ delay: 0.14 + index * 0.08, duration: 0.42 }}
            >
              <span className="mb-2 block h-1.5 w-8 rounded-full bg-[linear-gradient(90deg,#8b5cf6,#22d3ee)]" />
              <p className="text-xs font-semibold leading-4 text-white">{node.label}</p>
            </motion.div>
          ))}

          <motion.div
            animate={{ opacity: [0.72, 1, 0.72] }}
            className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.065] p-3"
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex flex-wrap gap-2">
              {apiLabels.map((label) => (
                <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[0.68rem] text-slate-200" key={label}>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MockupShell>
  );
}
