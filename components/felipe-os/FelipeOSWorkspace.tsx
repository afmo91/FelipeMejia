"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { caseStudies, type CaseStudyId } from "@/data/caseStudies";
import { experienceEntries } from "@/data/experience";
import { quickPrompts, type FelipeOSView } from "@/data/chatFlows";
import { services } from "@/data/services";
import { systems, type SystemId } from "@/data/systems";
import { StagePreview } from "@/components/mockups";

const EMAIL = "felipe.mejia@spotz.pro";
const LINKEDIN = "https://www.linkedin.com/in/felipemejiaosorio/";
const GITHUB = "https://github.com/afmo91";

type PublicCVData = {
  title: string;
  summary: string[];
  experience: Array<{
    company: string;
    role: string;
    metrics: string[];
    bullets: string[];
  }>;
  selectedAchievements?: string[];
  skills: Record<string, string[]>;
  tools?: string[];
  languages?: string[];
};

type RouteIntent = {
  view: FelipeOSView;
  response: string;
  systemId?: SystemId;
  caseStudyId?: CaseStudyId;
};

type DockItem = {
  id: FelipeOSView;
  label: string;
  icon: string;
};

const dockItems: DockItem[] = [
  { id: "command", label: "Command Center", icon: "C" },
  { id: "services", label: "Services", icon: "S" },
  { id: "systems", label: "Systems", icon: "Y" },
  { id: "case-studies", label: "Proof", icon: "P" },
  { id: "experience", label: "Experience", icon: "E" },
  { id: "cv", label: "CV", icon: "V" },
  { id: "hey-felipe", label: "Hey Felipe", icon: "HF" },
  { id: "contact", label: "Contact", icon: "@" },
];

const navItems: Array<{ id: FelipeOSView; label: string }> = [
  { id: "command", label: "Home" },
  { id: "services", label: "Services" },
  { id: "systems", label: "Systems" },
  { id: "case-studies", label: "Proof" },
  { id: "experience", label: "Experience" },
  { id: "cv", label: "CV" },
  { id: "contact", label: "Contact" },
];

const proofMetrics = [
  ["+25%", "conversion"],
  ["-30%", "CAC"],
  ["€200K+", "recovered"],
  ["5 days -> same-day", "activation"],
  ["€3M+", "annual media budget"],
];

const viewMeta: Record<FelipeOSView, { title: string; context: string }> = {
  command: {
    title: "Command Center",
    context: "AI systems, growth infrastructure, automation",
  },
  services: {
    title: "Services",
    context: "Workflow sprint, growth audit, assistant build, MVP build",
  },
  systems: {
    title: "Systems",
    context: "Agents, APIs, dashboards, integrations",
  },
  "case-studies": {
    title: "Proof of Work",
    context: "Safe representative systems and commercial value",
  },
  experience: {
    title: "Experience",
    context: "Product, growth and automation under commercial pressure",
  },
  cv: {
    title: "Public CV",
    context: "Public profile + downloadable CV",
  },
  "hey-felipe": {
    title: "Hey Felipe",
    context: "Command app and lightweight assistant",
  },
  contact: {
    title: "Contact",
    context: EMAIL,
  },
};

function routeMessage(input: string): RouteIntent {
  const exact = quickPrompts.find((item) => item.prompt.toLowerCase() === input.toLowerCase());
  if (exact) return exact;

  const text = input.toLowerCase();
  if (text.match(/service|offer|sprint|audit|buy|price|help|company|client/)) {
    return {
      view: "services",
      response: "Open Services. The clearest entry points are workflow sprint, growth audit, assistant build, and product/MVP build.",
    };
  }
  if (text.match(/proof|case|portfolio|work|example|result|growth|cac|roas|ads|attribution/)) {
    return {
      view: "case-studies",
      caseStudyId: text.includes("lead") ? "b2b-lead-crm-automation" : "paid-media-operating-layer",
      response: "Open Proof of Work. The examples are representative and safe: problem, system built, commercial value, and capabilities.",
    };
  }
  if (text.match(/system|ai|assistant|agent|workflow|automation|integration|crm|api|dashboard/)) {
    return {
      view: "systems",
      systemId: text.includes("dashboard") ? "product-dashboards" : text.includes("assistant") ? "ai-assistants" : "agentic-workflows",
      response: "Open Systems. The useful pattern is intake, context, decision, action, and feedback.",
    };
  }
  if (text.match(/cv|resume|role|recruit|job/)) {
    return {
      view: "cv",
      response: "Open CV. The public CV is visible and downloadable without login.",
    };
  }
  if (text.match(/contact|email|linkedin|hire|call|github/)) {
    return {
      view: "contact",
      response: "Open Contact. Send the workflow, tools, bottleneck, and target metric.",
    };
  }
  if (text.match(/experience|adamo|spotz|segmentta|career/)) {
    return {
      view: "experience",
      response: "Open Experience. The career line is product and growth under commercial pressure.",
    };
  }

  return {
    view: "services",
    response: "Start with Services. Bring the messy process and I will map the smallest useful system worth shipping.",
  };
}

export default function FelipeOSWorkspace({ publicCV }: { publicCV: PublicCVData }) {
  const [activeView, setActiveView] = useState<FelipeOSView>("command");
  const [activeSystemId, setActiveSystemId] = useState<SystemId>("ai-assistants");
  const [activeCaseId, setActiveCaseId] = useState<CaseStudyId>("paid-media-operating-layer");
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    function openCommand(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setActiveView("hey-felipe");
      }
    }

    window.addEventListener("keydown", openCommand);
    return () => window.removeEventListener("keydown", openCommand);
  }, []);

  function applyIntent(intent: RouteIntent) {
    setActiveView(intent.view);
    if (intent.systemId) setActiveSystemId(intent.systemId);
    if (intent.caseStudyId) setActiveCaseId(intent.caseStudyId);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05050b] text-slate-100">
      <DesktopBackground />
      <TopMenuBar activeView={activeView} onCommandOpen={() => setActiveView("hey-felipe")} onViewChange={setActiveView} />
      <DesktopShell
        activeCaseId={activeCaseId}
        activeSystemId={activeSystemId}
        activeView={activeView}
        focusMode={focusMode}
        onActiveCaseChange={setActiveCaseId}
        onActiveSystemChange={setActiveSystemId}
        onFocusModeChange={setFocusMode}
        onIntent={applyIntent}
        onViewChange={setActiveView}
        publicCV={publicCV}
      />
    </main>
  );
}

function DesktopBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0">
      <motion.div
        animate={{ opacity: [0.18, 0.36, 0.18], x: [-20, 22, -20], y: [-8, 10, -8] }}
        className="absolute left-[-14%] top-[10%] h-72 w-[62%] -rotate-12 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.32),rgba(34,211,238,0.08)_46%,transparent_70%)] blur-3xl"
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        animate={{ opacity: [0.14, 0.28, 0.14], x: [18, -18, 18], y: [8, -10, 8] }}
        className="absolute bottom-[2%] right-[-16%] h-80 w-[58%] rotate-12 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.24),rgba(139,92,246,0.1)_42%,transparent_68%)] blur-3xl"
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_18%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,rgba(3,3,8,0.15),rgba(0,0,0,0.8))]" />
    </div>
  );
}

function TopMenuBar({
  activeView,
  onCommandOpen,
  onViewChange,
}: {
  activeView: FelipeOSView;
  onCommandOpen: () => void;
  onViewChange: (view: FelipeOSView) => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/45 px-3 py-2 backdrop-blur-2xl sm:px-5">
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="group flex min-w-0 items-center gap-2 rounded-full px-2 py-1 text-left outline-none transition hover:bg-white/[0.055] focus-visible:bg-white/[0.08]"
            onClick={() => onViewChange("command")}
            type="button"
          >
            <span className="grid h-6 w-6 flex-none place-items-center rounded-lg bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)] text-[0.7rem] font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.25)]">
              F
            </span>
            <span className="font-semibold text-white">FelipeOS</span>
          </button>

          <nav aria-label="FelipeOS apps" className="hidden min-w-0 gap-1 overflow-x-auto lg:flex">
            {navItems.map((item) => (
              <button
                aria-current={activeView === item.id ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-xs font-medium outline-none transition ${
                  activeView === item.id
                    ? "bg-white/[0.09] text-white"
                    : "text-slate-400 hover:bg-white/[0.055] hover:text-slate-100 focus-visible:bg-white/[0.08]"
                }`}
                key={item.id}
                onClick={() => onViewChange(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-100 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.55)]" />
            Available for builds & advisory
          </span>
          <span className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1.5 text-xs font-medium text-emerald-100 sm:hidden">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Available
          </span>
          <button
            aria-label="Open Hey Felipe command app"
            className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1.5 text-xs font-medium text-slate-200 outline-none transition hover:border-cyan-300/30 hover:bg-cyan-300/10 focus-visible:border-cyan-200/50"
            onClick={onCommandOpen}
            type="button"
          >
            <span className="sm:hidden">Search</span>
            <span className="hidden sm:inline">Command</span>
          </button>
          <a aria-label="LinkedIn" className="hidden rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:text-white md:inline-flex" href={LINKEDIN} rel="noopener noreferrer" target="_blank">
            in
          </a>
          <a aria-label="GitHub" className="hidden rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/30 hover:text-white md:inline-flex" href={GITHUB} rel="noopener noreferrer" target="_blank">
            gh
          </a>
        </div>
      </div>
    </header>
  );
}

function DesktopShell(props: {
  activeCaseId: CaseStudyId;
  activeSystemId: SystemId;
  activeView: FelipeOSView;
  focusMode: boolean;
  onActiveCaseChange: (id: CaseStudyId) => void;
  onActiveSystemChange: (id: SystemId) => void;
  onFocusModeChange: (value: boolean) => void;
  onIntent: (intent: RouteIntent) => void;
  onViewChange: (view: FelipeOSView) => void;
  publicCV: PublicCVData;
}) {
  return (
    <div className={`relative z-10 flex min-h-screen flex-col px-3 pb-24 pt-14 sm:px-5 lg:pl-8 ${props.focusMode ? "lg:pr-8" : "lg:pr-[23.5rem]"}`}>
      {!props.focusMode ? <RightWidgetStack activeView={props.activeView} onViewChange={props.onViewChange} /> : null}

      <MainAppWindow
        activeCaseId={props.activeCaseId}
        activeSystemId={props.activeSystemId}
        activeView={props.activeView}
        focusMode={props.focusMode}
        onActiveCaseChange={props.onActiveCaseChange}
        onActiveSystemChange={props.onActiveSystemChange}
        onClose={() => props.onViewChange("command")}
        onFocusModeChange={props.onFocusModeChange}
        onIntent={props.onIntent}
        onViewChange={props.onViewChange}
        publicCV={props.publicCV}
      />

      <BottomDock activeView={props.activeView} onViewChange={props.onViewChange} />
    </div>
  );
}

function MainAppWindow(props: {
  activeCaseId: CaseStudyId;
  activeSystemId: SystemId;
  activeView: FelipeOSView;
  focusMode: boolean;
  onActiveCaseChange: (id: CaseStudyId) => void;
  onActiveSystemChange: (id: SystemId) => void;
  onClose: () => void;
  onFocusModeChange: (value: boolean) => void;
  onIntent: (intent: RouteIntent) => void;
  onViewChange: (view: FelipeOSView) => void;
  publicCV: PublicCVData;
}) {
  const meta = viewMeta[props.activeView];

  return (
    <section
      className={`mt-3 flex min-h-[calc(100vh-9.5rem)] w-full flex-col overflow-hidden rounded-[22px] border border-white/12 bg-[linear-gradient(145deg,rgba(13,13,22,0.88),rgba(6,11,20,0.78)_58%,rgba(18,11,34,0.72))] shadow-[0_28px_110px_rgba(0,0,0,0.58)] backdrop-blur-2xl sm:mt-5 sm:min-h-[calc(100vh-10rem)] ${
        props.focusMode ? "max-w-none" : "mx-auto max-w-5xl lg:mx-0 lg:w-[min(64vw,960px)]"
      }`}
    >
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-3">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-white sm:text-base">{meta.title}</h1>
          <p className="hidden truncate text-xs text-slate-400 sm:block">{meta.context}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
            onClick={() => props.onFocusModeChange(!props.focusMode)}
            type="button"
          >
            {props.focusMode ? "Exit focus" : "Focus"}
          </button>
          {props.activeView !== "command" ? (
            <button
              className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-purple-300/30 hover:text-white"
              onClick={props.onClose}
              type="button"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] sm:px-5 sm:py-5 [&::-webkit-scrollbar]:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 10 }}
            key={props.activeView}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            {props.activeView === "command" ? (
              <CommandCenterApp
                onOpenHeyFelipe={() => props.onViewChange("hey-felipe")}
                onOpenSystem={(id) => {
                  props.onActiveSystemChange(id);
                  props.onViewChange("systems");
                }}
                onViewChange={props.onViewChange}
              />
            ) : null}
            {props.activeView === "services" ? <ServicesApp onOpenHeyFelipe={() => props.onViewChange("hey-felipe")} /> : null}
            {props.activeView === "systems" ? (
              <SystemsApp activeSystemId={props.activeSystemId} onActiveSystemChange={props.onActiveSystemChange} />
            ) : null}
            {props.activeView === "case-studies" ? (
              <ProofApp activeCaseId={props.activeCaseId} onActiveCaseChange={props.onActiveCaseChange} />
            ) : null}
            {props.activeView === "experience" ? <ExperienceApp /> : null}
            {props.activeView === "cv" ? <CVApp publicCV={props.publicCV} /> : null}
            {props.activeView === "hey-felipe" ? <HeyFelipeApp onIntent={props.onIntent} /> : null}
            {props.activeView === "contact" ? <ContactApp onOpenHeyFelipe={() => props.onViewChange("hey-felipe")} /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function RightWidgetStack({ activeView, onViewChange }: { activeView: FelipeOSView; onViewChange: (view: FelipeOSView) => void }) {
  const focus = viewMeta[activeView].context;

  return (
    <aside className="fixed bottom-28 right-6 top-16 z-20 hidden w-[320px] content-start gap-4 overflow-y-auto [scrollbar-width:none] lg:grid [&::-webkit-scrollbar]:hidden">
      <section className="rounded-[22px] border border-white/10 bg-black/30 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-100/60">Availability</p>
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.6)]" />
        </div>
        <h2 className="mt-3 text-xl font-semibold text-white">Available</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">Product / Growth / AI systems</p>
        <p className="text-sm text-slate-400">Paris / Remote</p>
        <button
          className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100"
          onClick={() => onViewChange("contact")}
          type="button"
        >
          Contact →
        </button>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-black/26 p-4 backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/55">Proof metrics</p>
        <div className="mt-4 grid gap-2">
          {proofMetrics.map(([value, label]) => (
            <div className="rounded-2xl border border-white/[0.075] bg-white/[0.035] p-3" key={value}>
              <p className="text-lg font-semibold text-white">{value}</p>
              <p className="text-xs leading-5 text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-black/26 p-4 backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-purple-100/55">Current focus</p>
        <h2 className="mt-3 text-lg font-semibold text-white">{viewMeta[activeView].title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{focus}</p>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-black/26 p-4 backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/55">System status</p>
        <div className="mt-4 grid gap-2">
          {["APIs", "Automation", "Dashboards", "Growth"].map((item) => (
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.075] bg-white/[0.035] px-3 py-2" key={item}>
              <span className="text-sm text-slate-200">{item}</span>
              <motion.span
                animate={{ opacity: [0.45, 1, 0.45] }}
                className="h-2 w-2 rounded-full bg-cyan-300"
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function BottomDock({ activeView, onViewChange }: { activeView: FelipeOSView; onViewChange: (view: FelipeOSView) => void }) {
  return (
    <nav aria-label="FelipeOS dock" className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3">
      <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-[24px] border border-white/12 bg-black/55 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {dockItems.map((item) => {
          const active = activeView === item.id;
          return (
            <button
              aria-current={active ? "page" : undefined}
              className={`group flex h-12 min-w-12 cursor-pointer items-center gap-2 rounded-[18px] border px-3 text-left outline-none transition ${
                active
                  ? "border-cyan-300/35 bg-cyan-300/12 text-white shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                  : "border-white/10 bg-white/[0.045] text-slate-300 hover:-translate-y-1 hover:border-purple-300/35 hover:bg-purple-400/10 focus-visible:border-cyan-200/50"
              }`}
              key={item.id}
              onClick={() => onViewChange(item.id)}
              type="button"
            >
              <span className="grid h-7 w-7 flex-none place-items-center rounded-xl bg-white/[0.08] text-[0.68rem] font-bold text-white">
                {item.icon}
              </span>
              <span className={`${active ? "inline" : "hidden group-hover:inline"} whitespace-nowrap pr-1 text-xs font-semibold max-sm:hidden`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function CommandCenterApp({
  onOpenHeyFelipe,
  onOpenSystem,
  onViewChange,
}: {
  onOpenHeyFelipe: () => void;
  onOpenSystem: (id: SystemId) => void;
  onViewChange: (view: FelipeOSView) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.94fr_1.06fr] xl:items-start">
      <section className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Command Center</p>
        <h2 className="mt-5 text-[2.05rem] font-semibold leading-[1.05] text-white sm:text-5xl">
          I build AI-powered systems that turn messy operations into scalable growth engines.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Agentic workflows, AI assistants, automations, API integrations, paid growth systems and dashboards — designed, built and shipped.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {proofMetrics.map(([value, label]) => (
            <div className="rounded-2xl border border-white/[0.075] bg-black/[0.22] p-3" key={value}>
              <p className="text-base font-semibold text-white">{value}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100" onClick={() => onViewChange("services")} type="button">
            Explore services →
          </button>
          <button className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/50" onClick={() => onViewChange("case-studies")} type="button">
            See proof of work →
          </button>
          <button className="rounded-full border border-purple-300/25 bg-purple-400/10 px-4 py-2.5 text-sm font-semibold text-purple-100 transition hover:-translate-y-0.5 hover:border-cyan-300/35" onClick={onOpenHeyFelipe} type="button">
            Open Hey Felipe →
          </button>
        </div>
      </section>

      <SystemNetworkMap onOpenSystem={onOpenSystem} onViewChange={onViewChange} />
    </div>
  );
}

function SystemNetworkMap({
  onOpenSystem,
  onViewChange,
}: {
  onOpenSystem: (id: SystemId) => void;
  onViewChange: (view: FelipeOSView) => void;
}) {
  const nodes: Array<{ label: string; detail: string; systemId?: SystemId; view?: FelipeOSView }> = [
    { label: "AI Assistants", detail: "Answer, draft, classify", systemId: "ai-assistants" },
    { label: "Agentic Workflows", detail: "Research, decide, route", systemId: "agentic-workflows" },
    { label: "Automation & APIs", detail: "Connect the stack", systemId: "automation-integrations" },
    { label: "Growth Systems", detail: "Instrument the funnel", systemId: "growth-systems" },
    { label: "Product Dashboards", detail: "Decisions, not reports", systemId: "product-dashboards" },
    { label: "Proof of Work", detail: "Representative builds", view: "case-studies" },
  ];

  return (
    <section className="rounded-[22px] border border-white/10 bg-black/28 p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-purple-100/60">System map</p>
      <div className="relative mt-5 overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.2),rgba(255,255,255,0.025)_46%,transparent_74%)] p-4 sm:p-6">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-center shadow-[0_0_42px_rgba(34,211,238,0.14)]">
              <div>
                <p className="text-sm font-semibold text-white">FelipeOS</p>
                <p className="text-[0.68rem] text-cyan-100/70">operating layer</p>
              </div>
            </div>
          </div>
          {nodes.map((node) => (
            <button
              className="group cursor-pointer rounded-[18px] border border-white/10 bg-white/[0.045] p-4 text-left outline-none transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/[0.07] focus-visible:border-cyan-200/50"
              key={node.label}
              onClick={() => (node.systemId ? onOpenSystem(node.systemId) : onViewChange(node.view || "command"))}
              type="button"
            >
              <span className="block text-sm font-semibold text-white">{node.label}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">{node.detail}</span>
              <span className="mt-3 inline-flex text-xs font-semibold text-cyan-100/80 transition group-hover:translate-x-0.5">Open →</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesApp({ onOpenHeyFelipe }: { onOpenHeyFelipe: () => void }) {
  return (
    <div className="grid gap-5">
      <section className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Commercial apps</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">What clients can buy.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Practical, scoped builds for teams that want AI embedded in real operations, growth infrastructure, dashboards, and product delivery.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((service, index) => (
          <article className="rounded-[20px] border border-white/10 bg-black/28 p-5" key={service.title}>
            <p className="text-xs uppercase tracking-[0.16em] text-purple-100/55">Service {index + 1}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{service.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{service.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.15em] text-cyan-100/50">Deliverables</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {service.deliverables.map((deliverable) => (
                <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-slate-200" key={deliverable}>
                  {deliverable}
                </span>
              ))}
            </div>
            <a className="mt-5 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100" href={`mailto:${EMAIL}?subject=${encodeURIComponent(service.cta)}`}>
              {service.cta} →
            </a>
          </article>
        ))}
      </div>

      <section className="rounded-[22px] border border-emerald-300/15 bg-emerald-300/[0.06] p-5">
        <h3 className="text-xl font-semibold text-white">Have a messy workflow, growth problem or AI use case worth turning into a system?</h3>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100" href={`mailto:${EMAIL}`}>
            Email me →
          </a>
          <a className="rounded-full border border-white/15 bg-black/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-300/35" href={LINKEDIN} rel="noopener noreferrer" target="_blank">
            Connect on LinkedIn →
          </a>
          <button className="rounded-full border border-purple-300/25 bg-purple-400/10 px-4 py-2.5 text-sm font-semibold text-purple-100 transition hover:-translate-y-0.5 hover:border-cyan-300/35" onClick={onOpenHeyFelipe} type="button">
            Open Hey Felipe →
          </button>
        </div>
      </section>
    </div>
  );
}

function SystemsApp({
  activeSystemId,
  onActiveSystemChange,
}: {
  activeSystemId: SystemId;
  onActiveSystemChange: (id: SystemId) => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = systems.find((system) => system.id === activeSystemId) ?? systems[0];

  function selectSystem(id: SystemId) {
    onActiveSystemChange(id);
    setSheetOpen(true);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Systems</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Interactive build surfaces.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">Select a module to preview the operating layer and commercial value.</p>
        <div className="mt-5 grid gap-3">
          {systems.map((system) => (
            <button
              aria-pressed={active.id === system.id}
              className={`cursor-pointer rounded-[18px] border p-4 text-left outline-none transition ${
                active.id === system.id
                  ? "border-cyan-300/35 bg-cyan-300/10 text-white"
                  : "border-white/10 bg-white/[0.035] text-slate-300 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-cyan-300/[0.055] focus-visible:border-cyan-200/40"
              }`}
              key={system.id}
              onClick={() => selectSystem(system.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{system.title}</h3>
                <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[0.68rem] text-slate-300">{system.signal}</span>
              </div>
              <p className="mt-2 text-sm leading-6">{system.description}</p>
              <span className="mt-3 inline-flex text-xs font-semibold text-cyan-100/80">Open preview →</span>
            </button>
          ))}
        </div>
      </section>

      <div className="hidden xl:grid xl:content-start xl:gap-4">
        <SystemPreview system={active} />
      </div>

      <AnimatePresence>
        {sheetOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/55 p-3 pt-24 backdrop-blur-sm xl:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ y: 0 }}
              className="max-h-[78vh] overflow-y-auto rounded-[24px] border border-white/12 bg-[#090914] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
              exit={{ y: 40 }}
              initial={{ y: 40 }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{active.title}</h3>
                <button className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-slate-200" onClick={() => setSheetOpen(false)} type="button">
                  Close
                </button>
              </div>
              <SystemPreview system={active} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SystemPreview({ system }: { system: (typeof systems)[number] }) {
  return (
    <div className="grid gap-4">
      <StagePreview mockup={system.mockup} />
      <section className="rounded-[20px] border border-white/10 bg-black/28 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-purple-100/55">What it is</p>
        <p className="mt-2 text-sm leading-6 text-slate-200">{system.description}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-cyan-100/55">Example use cases</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {system.examples.map((example) => (
            <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-slate-200" key={example}>
              {example}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-cyan-100/55">Tools / integrations</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {system.tools.map((tool) => (
            <span className="rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1.5 text-xs text-purple-100" key={tool}>
              {tool}
            </span>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-100/60">Commercial value</p>
          <p className="mt-2 text-sm leading-6 text-emerald-50">{system.commercialValue}</p>
        </div>
      </section>
    </div>
  );
}

function ProofApp({ activeCaseId, onActiveCaseChange }: { activeCaseId: CaseStudyId; onActiveCaseChange: (id: CaseStudyId) => void }) {
  const active = caseStudies.find((study) => study.id === activeCaseId) ?? caseStudies[0];

  return (
    <div className="grid gap-5">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Proof of Work</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Safe representative systems.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Stylized product mockups and generic labels only. No sensitive client screenshots or data.</p>
      </section>

      <div className="flex gap-2 overflow-x-auto rounded-[18px] border border-white/10 bg-black/25 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {caseStudies.map((study) => (
          <button
            aria-pressed={active.id === study.id}
            className={`flex-none cursor-pointer rounded-[14px] px-3 py-2 text-left text-xs font-medium outline-none transition sm:px-4 ${
              active.id === study.id ? "bg-cyan-300/12 text-white" : "text-slate-400 hover:bg-white/[0.055] hover:text-slate-100"
            }`}
            key={study.id}
            onClick={() => onActiveCaseChange(study.id)}
            type="button"
          >
            {study.title} →
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <StagePreview mockup={active.mockup} />
        <article className="rounded-[20px] border border-white/10 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-purple-100/55">{active.category}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{active.title}</h3>
          <p className="mt-2 text-sm font-medium text-cyan-100">{active.subtitle}</p>
          <div className="mt-5 grid gap-3">
            {[
              ["Problem", active.problem],
              ["System built", active.system],
              ["Commercial value", active.commercialValue],
            ].map(([label, copy]) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={label}>
                <p className="text-[0.68rem] uppercase tracking-[0.15em] text-cyan-100/50">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{copy}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[0.68rem] uppercase tracking-[0.15em] text-cyan-100/50">Capabilities</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {active.capabilities.map((capability) => (
              <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-slate-200" key={capability}>
                {capability}
              </span>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function ExperienceApp() {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Experience</p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Operator timeline for product, growth and automation.</h2>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {experienceEntries.map((entry, index) => (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[20px] border border-white/10 bg-white/[0.045] p-4"
            initial={{ opacity: 0, y: 12 }}
            key={entry.company}
            transition={{ delay: index * 0.06, duration: 0.32 }}
          >
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

function CVApp({ publicCV }: { publicCV: PublicCVData }) {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const activeRole = publicCV.experience[activeRoleIndex] ?? publicCV.experience[0];

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Public CV</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{publicCV.title}</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            {publicCV.summary.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <a className="mt-6 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100" href="/cv/felipe-mejia-public-cv.pdf">
            Download CV →
          </a>
        </div>

        <div className="grid gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-purple-100/60">Interactive timeline</p>
          <div className="grid gap-3 md:grid-cols-[0.82fr_1.18fr]">
            <div className="grid gap-2">
              {publicCV.experience.map((role, index) => (
                <button
                  aria-pressed={activeRoleIndex === index}
                  className={`cursor-pointer rounded-2xl border p-3 text-left outline-none transition ${
                    activeRoleIndex === index
                      ? "border-cyan-300/35 bg-cyan-300/10"
                      : "border-white/10 bg-white/[0.035] hover:-translate-y-0.5 hover:border-cyan-300/25"
                  }`}
                  key={`${role.company}-${role.role}`}
                  onClick={() => setActiveRoleIndex(index)}
                  type="button"
                >
                  <p className="text-sm font-semibold text-white">{role.company}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{role.role}</p>
                </button>
              ))}
            </div>
            <article className="rounded-[20px] border border-white/10 bg-black/28 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/55">{activeRole.company}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{activeRole.role}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeRole.metrics.map((metric) => (
                  <span className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[0.68rem] text-slate-200" key={metric}>
                    {metric}
                  </span>
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {activeRole.bullets.map((bullet) => (
                  <li className="border-l border-cyan-300/35 pl-3 text-sm leading-6 text-slate-300" key={bullet}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[20px] border border-white/10 bg-black/28 p-4 lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Achievements</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(publicCV.selectedAchievements || []).map((achievement) => (
              <p className="rounded-2xl border border-white/[0.075] bg-white/[0.035] p-3 text-sm leading-6 text-slate-200" key={achievement}>
                {achievement}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-black/28 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-purple-100/60">Languages</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(publicCV.languages || []).map((language) => (
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs text-emerald-100" key={language}>
                {language}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[20px] border border-white/10 bg-black/28 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Skills</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(publicCV.skills).map(([group, items]) => (
              <div className="rounded-2xl border border-white/[0.075] bg-white/[0.035] p-3" key={group}>
                <p className="text-sm font-semibold text-white">{group}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{items.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-black/28 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-purple-100/60">Tools</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(publicCV.tools || []).map((tool) => (
              <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-slate-200" key={tool}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeyFelipeApp({ onIntent }: { onIntent: (intent: RouteIntent) => void }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "felipe"; text: string }>>([
    {
      role: "felipe",
      text: "Ask what I can build for your team, or open one of the FelipeOS apps.",
    },
  ]);
  const [input, setInput] = useState("");
  const suggestions = useMemo(
    () => ["Show services", "Show proof of work", "Show systems", "Open CV", "Contact Felipe"],
    [],
  );

  function submit(text: string) {
    const value = text.trim();
    if (!value) return;
    const intent = routeMessage(value);
    setMessages((current) => [...current, { role: "user", text: value }, { role: "felipe", text: intent.response }]);
    setInput("");
    onIntent(intent);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-4">
      <section className="rounded-[22px] border border-white/10 bg-black/30 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/55">Command app</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Hey Felipe</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Fast routing for services, proof, systems, CV and contact. Cmd/Ctrl + K opens this app.</p>
      </section>

      <div className="max-h-72 overflow-y-auto rounded-[22px] border border-white/10 bg-white/[0.035] p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid gap-3">
          {messages.slice(-8).map((message, index) => (
            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`} key={`${message.role}-${index}-${message.text}`}>
              <p className={`max-w-[86%] rounded-2xl border px-3 py-2.5 text-sm leading-6 ${message.role === "user" ? "border-cyan-300/20 bg-cyan-300/10 text-white" : "border-white/10 bg-black/28 text-slate-100"}`}>
                {message.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((action) => (
          <button className="cursor-pointer rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1.5 text-xs text-purple-100 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/10" key={action} onClick={() => submit(action)} type="button">
            {action}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit(input);
        }}
      >
        <input
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/35"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask what I can build for your team..."
          value={input}
        />
        <button className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-cyan-100" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

function ContactApp({ onOpenHeyFelipe }: { onOpenHeyFelipe: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[22px] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Contact</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">Have a messy workflow, growth problem or AI use case worth turning into a system?</h2>
        <p className="mt-5 text-base leading-7 text-slate-300">
          Send the context: the workflow, the tools, the bottleneck and the metric that would make the system worth building.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100" href={`mailto:${EMAIL}`}>
            Email me →
          </a>
          <a className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/50" href={LINKEDIN} rel="noopener noreferrer" target="_blank">
            Connect on LinkedIn →
          </a>
          <button className="rounded-full border border-purple-300/25 bg-purple-400/10 px-4 py-2.5 text-sm font-semibold text-purple-100 transition hover:-translate-y-0.5 hover:border-cyan-300/35" onClick={onOpenHeyFelipe} type="button">
            Open Hey Felipe →
          </button>
        </div>
      </section>
      <section className="grid content-start gap-3 rounded-[22px] border border-white/10 bg-black/30 p-5 sm:p-7">
        <a className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-white transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/10" href={`mailto:${EMAIL}`}>
          <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">Email</span>
          <span className="mt-1 block text-lg font-semibold">{EMAIL} →</span>
        </a>
        <a className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-white transition hover:-translate-y-0.5 hover:border-purple-300/30 hover:bg-purple-400/10" href={LINKEDIN} rel="noopener noreferrer" target="_blank">
          <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">LinkedIn</span>
          <span className="mt-1 block text-lg font-semibold">felipemejiaosorio →</span>
        </a>
        <a className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-white transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/10" href={GITHUB} rel="noopener noreferrer" target="_blank">
          <span className="block text-xs uppercase tracking-[0.16em] text-slate-400">GitHub</span>
          <span className="mt-1 block text-lg font-semibold">github.com/afmo91 →</span>
        </a>
      </section>
    </div>
  );
}
