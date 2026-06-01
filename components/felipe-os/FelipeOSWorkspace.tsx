"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { caseStudies, type CaseStudyId } from "@/data/caseStudies";
import { experienceEntries } from "@/data/experience";
import { quickPrompts, type FelipeOSView } from "@/data/chatFlows";
import { systems, type SystemId } from "@/data/systems";
import { StagePreview } from "@/components/mockups";

const EMAIL = "felipe.mejia@spotz.pro";
const LINKEDIN = "https://www.linkedin.com/in/felipemejiaosorio/";
const GITHUB = "https://github.com/afmo91";

const tabs: Array<{ id: FelipeOSView; label: string }> = [
  { id: "command", label: "Command Center" },
  { id: "systems", label: "Systems" },
  { id: "case-studies", label: "Case Studies" },
  { id: "experience", label: "Experience" },
  { id: "cv", label: "CV" },
  { id: "contact", label: "Contact" },
];

const proofMetrics = [
  ["+25%", "conversion", "Experimentation"],
  ["-30%", "CAC", "Acquisition"],
  ["€200K+", "recovered", "Attribution"],
  ["5 days → same-day", "activation", "Onboarding"],
  ["€3M+", "annual media budget managed", "Scale"],
];

const systemMapModules: Array<{
  title: string;
  description: string;
  systemId?: SystemId;
  view?: FelipeOSView;
}> = [
  {
    title: "AI Assistants",
    description: "Search, draft, classify and guide work.",
    systemId: "ai-assistants",
  },
  {
    title: "Agentic Workflows",
    description: "Research, decide, route and update systems.",
    systemId: "agentic-workflows",
  },
  {
    title: "Automation & APIs",
    description: "Connect tools so work moves without copy-paste.",
    systemId: "automation-integrations",
  },
  {
    title: "Growth Systems",
    description: "Funnels, attribution and experiments with proof.",
    systemId: "growth-systems",
  },
  {
    title: "Product Dashboards",
    description: "Operating views for products, teams and clients.",
    systemId: "product-builds",
  },
  {
    title: "Case Studies",
    description: "Representative builds and commercial outcomes.",
    view: "case-studies",
  },
];

type RouteIntent = {
  view: FelipeOSView;
  response: string;
  systemId?: SystemId;
  caseStudyId?: CaseStudyId;
  nextActions: string[];
};

function routeMessage(input: string): RouteIntent {
  const exact = quickPrompts.find((item) => item.prompt.toLowerCase() === input.toLowerCase());
  if (exact) return exact;

  const text = input.toLowerCase();
  if (text.match(/cv|resume|role|recruit|job/)) {
    return {
      view: "cv",
      response: "The CV workspace is protected so tailored PDFs stay consistent with the public profile.",
      nextActions: ["Show experience", "Show case studies", "Contact Felipe"],
    };
  }
  if (text.match(/contact|email|linkedin|hire|call|github/)) {
    return {
      view: "contact",
      response: "Best path: send the messy workflow or role context by email, then we can scope the highest-value system.",
      nextActions: ["Show me AI systems", "Open CV", "Show case studies"],
    };
  }
  if (text.match(/growth|cac|conversion|ads|attribution|roas|funnel|result|proof/)) {
    return {
      view: "case-studies",
      caseStudyId: "paid-ads-notre-dame",
      response: "For growth work, I connect acquisition, landing pages, attribution and experiments into one measurable loop.",
      nextActions: ["Show me AI systems", "What can you build?", "Contact Felipe"],
    };
  }
  if (text.match(/ai|assistant|agent|workflow|automation|integration|crm|api/)) {
    return {
      view: "systems",
      systemId: text.includes("assistant") ? "ai-assistants" : "agentic-workflows",
      response: "The best AI systems start as clear operational loops: intake, context, decision, action and feedback.",
      nextActions: ["Show case studies", "Show growth results", "Contact Felipe"],
    };
  }
  if (text.match(/experience|adamo|spotz|segmentta|career/)) {
    return {
      view: "experience",
      response: "My experience sits where product delivery, growth pressure and automation meet.",
      nextActions: ["Open CV", "Show case studies", "Contact Felipe"],
    };
  }

  return {
    view: "systems",
    systemId: "automation-integrations",
    response: "I would start by mapping the workflow, finding the missing signal, then building the smallest useful system that changes the team's cadence.",
    nextActions: ["Show me AI systems", "Show growth results", "Contact Felipe"],
  };
}

export default function FelipeOSWorkspace() {
  const [activeView, setActiveView] = useState<FelipeOSView>("command");
  const [activeSystemId, setActiveSystemId] = useState<SystemId>("ai-assistants");
  const [activeCaseId, setActiveCaseId] = useState<CaseStudyId>("spotz");
  const [chatOpen, setChatOpen] = useState(false);

  function applyIntent(intent: RouteIntent) {
    setActiveView(intent.view);
    if (intent.systemId) setActiveSystemId(intent.systemId);
    if (intent.caseStudyId) setActiveCaseId(intent.caseStudyId);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030306] px-3 py-3 text-slate-100 sm:px-5 sm:py-5 lg:px-8 lg:py-7">
      <StageAmbient />
      <FelipeOSFrame
        activeCaseId={activeCaseId}
        activeSystemId={activeSystemId}
        activeView={activeView}
        chatOpen={chatOpen}
        onActiveCaseChange={setActiveCaseId}
        onActiveSystemChange={setActiveSystemId}
        onChatOpenChange={setChatOpen}
        onIntent={applyIntent}
        onViewChange={setActiveView}
      />
    </main>
  );
}

export function StageAmbient() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        animate={{ opacity: [0.18, 0.34, 0.18], x: [-18, 18, -18] }}
        className="absolute left-[-12%] top-[8%] h-44 w-[64%] -rotate-12 bg-[linear-gradient(90deg,rgba(139,92,246,0.24),rgba(34,211,238,0.05),transparent)] blur-3xl"
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        animate={{ opacity: [0.12, 0.3, 0.12], x: [16, -16, 16] }}
        className="absolute bottom-[8%] right-[-10%] h-48 w-[68%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.2),rgba(139,92,246,0.12))] blur-3xl"
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,transparent,rgba(0,0,0,0.74))]" />
    </div>
  );
}

function FelipeOSFrame(props: {
  activeCaseId: CaseStudyId;
  activeSystemId: SystemId;
  activeView: FelipeOSView;
  chatOpen: boolean;
  onActiveCaseChange: (id: CaseStudyId) => void;
  onActiveSystemChange: (id: SystemId) => void;
  onChatOpenChange: (open: boolean) => void;
  onIntent: (intent: RouteIntent) => void;
  onViewChange: (view: FelipeOSView) => void;
}) {
  return (
    <section className="relative z-10 mx-auto flex h-[calc(100vh-1.5rem)] w-full max-w-[1480px] flex-col overflow-hidden rounded-[24px] border border-white/12 bg-[linear-gradient(145deg,rgba(13,13,22,0.9),rgba(6,10,18,0.86)_52%,rgba(20,12,36,0.78))] shadow-[0_34px_120px_rgba(0,0,0,0.58)] backdrop-blur-2xl sm:h-[calc(100vh-2.5rem)] sm:rounded-[28px]">
      <OSWindowTopBar />
      <OSTabBar activeView={props.activeView} onViewChange={props.onViewChange} />
      <StagePane
        activeCaseId={props.activeCaseId}
        activeSystemId={props.activeSystemId}
        activeView={props.activeView}
        onActiveCaseChange={props.onActiveCaseChange}
        onActiveSystemChange={props.onActiveSystemChange}
        onViewChange={props.onViewChange}
      />
      <HeyFelipeDock
        chatOpen={props.chatOpen}
        onChatOpenChange={props.onChatOpenChange}
        onIntent={props.onIntent}
      />
    </section>
  );
}

function OSWindowTopBar() {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-3 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-amber-300/90" />
          <span className="h-3 w-3 rounded-full bg-emerald-300/90" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-white sm:text-base">FelipeOS</h1>
          <p className="hidden text-xs text-slate-400 sm:block">Product / Growth / AI systems</p>
        </div>
      </div>
      <div className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-100 md:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.55)]" />
        Available for builds and advisory
      </div>
    </div>
  );
}

function OSTabBar({ activeView, onViewChange }: { activeView: FelipeOSView; onViewChange: (view: FelipeOSView) => void }) {
  return (
    <nav aria-label="FelipeOS workspace navigation" className="border-b border-white/10 px-2 py-2 sm:px-4">
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            aria-current={activeView === tab.id ? "page" : undefined}
            className={`relative flex-none rounded-full px-3.5 py-2 text-xs font-medium outline-none transition sm:px-4 ${
              activeView === tab.id
                ? "text-white"
                : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100 focus-visible:bg-white/[0.06]"
            }`}
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            type="button"
          >
            {activeView === tab.id ? (
              <motion.span
                className="absolute inset-0 rounded-full border border-cyan-300/25 bg-[linear-gradient(135deg,rgba(139,92,246,0.24),rgba(34,211,238,0.12))] shadow-[0_0_28px_rgba(139,92,246,0.22)]"
                layoutId="felipe-os-active-tab"
              />
            ) : null}
            <span className="relative">{tab.label}</span>
            {activeView === tab.id ? (
              <motion.span className="absolute -bottom-2 left-1/2 h-px w-8 -translate-x-1/2 bg-cyan-200/80" layoutId="felipe-os-active-underline" />
            ) : null}
          </button>
        ))}
      </div>
    </nav>
  );
}

function StagePane(props: {
  activeCaseId: CaseStudyId;
  activeSystemId: SystemId;
  activeView: FelipeOSView;
  onActiveCaseChange: (id: CaseStudyId) => void;
  onActiveSystemChange: (id: SystemId) => void;
  onViewChange: (view: FelipeOSView) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 pb-28 [scrollbar-width:none] sm:px-5 lg:px-6 [&::-webkit-scrollbar]:hidden">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          initial={{ opacity: 0, y: 10 }}
          key={props.activeView}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {props.activeView === "command" ? (
            <CommandCenterView
              onOpenCaseStudies={() => props.onViewChange("case-studies")}
              onOpenSystem={(id) => {
                props.onActiveSystemChange(id);
                props.onViewChange("systems");
              }}
              onShowProof={() => props.onViewChange("case-studies")}
              onShowSystems={() => props.onViewChange("systems")}
            />
          ) : null}
          {props.activeView === "systems" ? (
            <SystemsView activeSystemId={props.activeSystemId} onActiveSystemChange={props.onActiveSystemChange} />
          ) : null}
          {props.activeView === "case-studies" ? (
            <CaseStudiesView activeCaseId={props.activeCaseId} onActiveCaseChange={props.onActiveCaseChange} />
          ) : null}
          {props.activeView === "experience" ? <ExperienceView /> : null}
          {props.activeView === "cv" ? <CVWorkspaceView /> : null}
          {props.activeView === "contact" ? <ContactView /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CommandCenterView({
  onOpenCaseStudies,
  onOpenSystem,
  onShowProof,
  onShowSystems,
}: {
  onOpenCaseStudies: () => void;
  onOpenSystem: (id: SystemId) => void;
  onShowProof: () => void;
  onShowSystems: () => void;
}) {
  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[0.9fr_1.1fr] xl:items-stretch">
      <div className="min-w-0 rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Command Center</p>
          <h2 className="mt-5 max-w-3xl break-words text-[2.05rem] font-semibold leading-[1.05] text-white sm:text-5xl">
            I build AI-powered systems that turn messy operations into scalable growth engines.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Agentic workflows, AI assistants, automations, API integrations, paid growth systems and dashboards — designed, built and shipped.
          </p>
        </div>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {proofMetrics.map(([value, label, tag]) => (
            <MetricWidget key={value} label={label} tag={tag} value={value} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-[0_12px_30px_rgba(255,255,255,0.08)] transition hover:bg-cyan-100" onClick={onShowSystems} type="button">
            Explore systems
          </button>
          <button className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15" onClick={onShowProof} type="button">
            Show proof
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-4">
        <div className="rounded-[22px] border border-white/10 bg-black/28 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-purple-100/60">FelipeOS System Map</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Pick a system surface.</h3>
            </div>
            <span className="hidden rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100 sm:inline-flex">
              Adaptive stage
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {systemMapModules.map((module, index) => (
              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className="group rounded-[18px] border border-white/10 bg-white/[0.045] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] outline-none transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.07] focus-visible:border-cyan-200/50"
                initial={{ opacity: 0, y: 8 }}
                key={module.title}
                onClick={() => (module.systemId ? onOpenSystem(module.systemId) : onOpenCaseStudies())}
                transition={{ delay: index * 0.04, duration: 0.32 }}
                type="button"
              >
                <span className="mb-3 block h-1.5 w-10 rounded-full bg-[linear-gradient(90deg,#8b5cf6,#22d3ee)] opacity-70 transition group-hover:w-16 group-hover:opacity-100" />
                <span className="block text-base font-semibold text-white">{module.title}</span>
                <span className="mt-1 block text-sm leading-6 text-slate-400">{module.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricWidget({ label, value }: { label: string; tag: string; value: string }) {
  return (
    <motion.div
      className="min-w-[8.25rem] rounded-[16px] border border-white/10 bg-black/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-w-0"
      whileHover={{ y: -3 }}
      transition={{ damping: 25, stiffness: 260, type: "spring" }}
    >
      <p className="text-base font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-300">{label}</p>
    </motion.div>
  );
}

function SystemsView({
  activeSystemId,
  onActiveSystemChange,
}: {
  activeSystemId: SystemId;
  onActiveSystemChange: (id: SystemId) => void;
}) {
  const active = systems.find((system) => system.id === activeSystemId) ?? systems[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Systems</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Systems I build.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">Each module changes the active workspace preview.</p>
        <div className="mt-5 grid gap-3">
          {systems.map((system) => (
            <button
              aria-pressed={active.id === system.id}
              className={`rounded-[18px] border p-4 text-left outline-none transition ${
                active.id === system.id
                  ? "border-cyan-300/35 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(34,211,238,0.08))] shadow-[0_0_34px_rgba(34,211,238,0.1)]"
                  : "border-white/10 bg-white/[0.035] hover:border-cyan-300/25 hover:bg-cyan-300/[0.055] focus-visible:border-cyan-200/40"
              }`}
              key={system.id}
              onClick={() => onActiveSystemChange(system.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{system.title}</h3>
                <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[0.68rem] text-slate-300">{system.signal}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{system.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <StagePreview mockup={active.mockup} />
        <div className="rounded-[20px] border border-white/10 bg-black/28 p-4">
          <div className="flex flex-wrap gap-2">
            {active.examples.map((example) => (
              <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-slate-200" key={example}>
                {example}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudiesView({
  activeCaseId,
  onActiveCaseChange,
}: {
  activeCaseId: CaseStudyId;
  onActiveCaseChange: (id: CaseStudyId) => void;
}) {
  const active = caseStudies.find((study) => study.id === activeCaseId) ?? caseStudies[0];

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Selected work</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Product renders with proof attached.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Stylized mockups show the system without exposing client data.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto rounded-[18px] border border-white/10 bg-black/25 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {caseStudies.map((study) => (
            <button
              aria-pressed={active.id === study.id}
              className={`flex-none rounded-[14px] px-3 py-2 text-left text-xs font-medium outline-none transition sm:px-4 ${
                active.id === study.id
                  ? "bg-[linear-gradient(135deg,rgba(139,92,246,0.32),rgba(34,211,238,0.16))] text-white shadow-[0_0_22px_rgba(139,92,246,0.18)]"
                  : "text-slate-400 hover:bg-white/[0.055] hover:text-slate-100 focus-visible:bg-white/[0.07]"
              }`}
              key={study.id}
              onClick={() => onActiveCaseChange(study.id)}
              type="button"
            >
              {study.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <StagePreview mockup={active.mockup} />
        <article className="rounded-[20px] border border-white/10 bg-black/30 p-4">
          <div className="grid gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-purple-100/55">{active.category}</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">{active.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{active.copy}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {active.proof.map((item) => (
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs text-emerald-100" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              ["Problem", active.problem],
              ["System built", active.system],
              ["Outcome / proof", active.outcome],
            ].map(([label, copy]) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={label}>
                <p className="text-[0.68rem] uppercase tracking-[0.15em] text-cyan-100/50">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{copy}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function ExperienceView() {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Experience</p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Operator timeline for product, growth and automation.</h2>
      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {experienceEntries.map((entry, index) => (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[20px] border border-white/10 bg-white/[0.045] p-4"
            initial={{ opacity: 0, y: 12 }}
            key={entry.company}
            transition={{ delay: index * 0.08, duration: 0.36 }}
          >
            <div className="absolute -left-2 top-5 hidden h-px w-4 bg-[linear-gradient(90deg,#8b5cf6,#22d3ee)] lg:block" />
            <span className="mb-4 block h-2 w-16 rounded-full bg-[linear-gradient(90deg,#8b5cf6,#22d3ee)]" />
            <h3 className="text-lg font-semibold text-white">{entry.company}</h3>
            <p className="mt-1 text-sm text-cyan-100/70">{entry.role}</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">{entry.copy}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.proof.map((item) => (
                <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[0.68rem] text-slate-200" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function CVWorkspaceView() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Protected CV workspace</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Want the full CV or a tailored version for a specific role?</h2>
        <p className="mt-4 text-base leading-7 text-slate-300">
          Open the protected CV workspace for structured data, tailored versions and downloadable PDFs. Public and private versions stay aligned.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-100" href="/cv">
            Open protected CV
          </Link>
          <Link className="rounded-full border border-white/10 bg-black/25 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-purple-300/30" href="/login">
            Login
          </Link>
        </div>
      </div>
      <div className="rounded-[22px] border border-white/10 bg-black/30 p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-purple-100/60">Professional profile</p>
        <div className="mt-5 grid gap-3">
          {["12+ years across telecom, e-commerce, B2B SaaS and consulting.", "Built AI-powered workflows, dashboards, onboarding systems and paid growth loops.", "Best fit: product, growth and AI systems work with clear commercial outcomes."].map((line) => (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-200" key={line}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactView() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Contact</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">Have a messy workflow, growth problem or AI use case worth turning into a system?</h2>
        <p className="mt-5 text-base leading-7 text-slate-300">
          Send the context: the workflow, the tools, the bottleneck and the metric that would make the system worth building.
        </p>
      </div>
      <div className="grid content-start gap-3 rounded-[22px] border border-white/10 bg-black/30 p-5 sm:p-7">
        <a className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-white transition hover:border-cyan-300/30 hover:bg-cyan-300/10" href={`mailto:${EMAIL}`}>
          <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">Email me</span>
          <span className="mt-1 block text-lg font-semibold">{EMAIL}</span>
        </a>
        <a className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-white transition hover:border-purple-300/30 hover:bg-purple-400/10" href={LINKEDIN} rel="noopener noreferrer" target="_blank">
          <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">Connect on LinkedIn</span>
          <span className="mt-1 block text-lg font-semibold">felipemejiaosorio</span>
        </a>
        <a className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-white transition hover:border-cyan-300/30 hover:bg-cyan-300/10" href={GITHUB} rel="noopener noreferrer" target="_blank">
          <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">See GitHub</span>
          <span className="mt-1 block text-lg font-semibold">github.com/afmo91</span>
        </a>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function HeyFelipeDock({
  chatOpen,
  onChatOpenChange,
  onIntent,
}: {
  chatOpen: boolean;
  onChatOpenChange: (open: boolean) => void;
  onIntent: (intent: RouteIntent) => void;
}) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "felipe"; text: string }>>([
    {
      role: "felipe",
      text: "Hi, I'm Felipe. I build AI-powered systems for product, growth and operations. What would you like to explore?",
    },
  ]);
  const [input, setInput] = useState("");
  const suggestions = quickPrompts.slice(0, 4).map((route) => route.prompt);

  function submit(text: string) {
    const value = text.trim();
    if (!value) return;
    const intent = routeMessage(value);
    onIntent(intent);
    onChatOpenChange(true);
    setMessages((current) => [...current, { role: "user", text: value }, { role: "felipe", text: intent.response }]);
    setInput("");
  }

  return (
    <div className="absolute inset-x-3 bottom-3 z-30 sm:inset-x-5 sm:bottom-5">
      <AnimatePresence mode="wait">
        {chatOpen ? (
          <ChatPanel
            key="hey-felipe-panel"
            input={input}
            messages={messages}
            suggestions={suggestions}
            onClose={() => onChatOpenChange(false)}
            onInputChange={setInput}
            onSubmit={submit}
          />
        ) : (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[22px] border border-white/10 bg-black/60 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            exit={{ opacity: 0, y: 12 }}
            initial={{ opacity: 0, y: 12 }}
            key="hey-felipe-dock"
            transition={{ damping: 26, stiffness: 260, type: "spring" }}
          >
            <button
              className="flex w-full min-w-0 items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.055] px-4 py-3 text-left outline-none transition hover:border-purple-300/30 hover:bg-purple-400/[0.07] focus-visible:border-cyan-200/45"
              onClick={() => onChatOpenChange(true)}
              type="button"
            >
              <span className="grid h-9 w-9 flex-none place-items-center rounded-2xl bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)] text-sm font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.28)]">HF</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">Hey Felipe — ask what I can build for your team…</span>
                <span className="hidden truncate text-xs text-slate-400 sm:block">Command palette for systems, proof, CV and contact.</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatPanel({
  input,
  messages,
  suggestions,
  onClose,
  onInputChange,
  onSubmit,
}: {
  input: string;
  messages: Array<{ role: "user" | "felipe"; text: string }>;
  suggestions: string[];
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="ml-auto max-h-[min(70vh,36rem)] w-full max-w-3xl overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(10,10,18,0.99),rgba(8,15,24,0.985))] shadow-[0_22px_90px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
      exit={{ opacity: 0, y: 12 }}
      initial={{ opacity: 0, y: 12 }}
      transition={{ damping: 26, stiffness: 260, type: "spring" }}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Hey Felipe</p>
          <p className="text-xs text-slate-400">Dockable assistant / command palette</p>
        </div>
        <button aria-label="Close Hey Felipe" className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-slate-300 transition hover:border-cyan-300/30 hover:text-white" onClick={onClose} type="button">
          <CloseIcon />
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid gap-3">
          {messages.slice(-6).map((message, index) => (
            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`} key={`${message.role}-${index}-${message.text}`}>
              <p
                className={`max-w-[86%] rounded-2xl border px-3 py-2.5 text-sm leading-6 ${
                  message.role === "user"
                    ? "border-cyan-300/20 bg-cyan-300/10 text-white"
                    : "border-white/10 bg-white/[0.055] text-slate-100"
                }`}
              >
                {message.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((action) => (
            <button className="rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1.5 text-xs text-purple-100 transition hover:border-cyan-300/30 hover:bg-cyan-300/10" key={action} onClick={() => onSubmit(action)} type="button">
              {action}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(input);
          }}
        >
          <input
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/35"
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Ask what I can build for your team..."
            value={input}
          />
          <button className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-cyan-100" type="submit">
            Send
          </button>
        </form>
      </div>
    </motion.div>
  );
}
