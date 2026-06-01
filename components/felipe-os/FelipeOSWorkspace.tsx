"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Code2,
  FileText,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Moon,
  Network,
  Search,
  Sun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import FelipeOSLogo from "@/components/brand/FelipeOSLogo";
import FelipeOSWordmark from "@/components/brand/FelipeOSWordmark";
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
  icon: LucideIcon;
};

const dockItems: DockItem[] = [
  { id: "command", label: "Command Center", icon: LayoutDashboard },
  { id: "services", label: "Services", icon: BriefcaseBusiness },
  { id: "systems", label: "Systems", icon: Network },
  { id: "case-studies", label: "Proof", icon: BadgeCheck },
  { id: "experience", label: "Experience", icon: Clock3 },
  { id: "cv", label: "CV", icon: FileText },
  { id: "hey-felipe", label: "Hey Felipe", icon: MessageCircle },
  { id: "contact", label: "Contact", icon: Mail },
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
  ["5 days → same-day", "activation"],
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [motionEnabled, setMotionEnabled] = useState(
    () => typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

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
    <main className="relative min-h-screen overflow-hidden bg-[var(--fos-bg)] text-[var(--fos-text)]" data-felipe-theme={theme}>
      <DesktopBackground motionEnabled={motionEnabled} />
      <TopMenuBar
        activeView={activeView}
        motionEnabled={motionEnabled}
        onCommandOpen={() => setActiveView("hey-felipe")}
        onMotionToggle={() => setMotionEnabled((current) => !current)}
        onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        onViewChange={setActiveView}
        theme={theme}
      />
      <DesktopShell
        activeCaseId={activeCaseId}
        activeSystemId={activeSystemId}
        activeView={activeView}
        focusMode={focusMode}
        motionEnabled={motionEnabled}
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

function DesktopBackground({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0">
      <motion.div
        animate={motionEnabled ? { opacity: [0.18, 0.36, 0.18], x: [-20, 22, -20], y: [-8, 10, -8] } : { opacity: 0.24 }}
        className="absolute left-[-14%] top-[8%] h-[34rem] w-[68%] -rotate-12 rounded-full bg-[radial-gradient(circle,var(--fos-wallpaper-1),rgba(34,211,238,0.08)_46%,transparent_70%)] blur-3xl"
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        animate={motionEnabled ? { opacity: [0.14, 0.28, 0.14], x: [18, -18, 18], y: [8, -10, 8] } : { opacity: 0.2 }}
        className="absolute bottom-[-4%] right-[-16%] h-[36rem] w-[62%] rotate-12 rounded-full bg-[radial-gradient(circle,var(--fos-wallpaper-2),rgba(139,92,246,0.1)_42%,transparent_68%)] blur-3xl"
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        animate={motionEnabled ? { backgroundPosition: ["0px 0px", "56px 38px"] } : undefined}
        className="absolute inset-0 opacity-[0.085] [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:56px_56px]"
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
      />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_14%_24%,rgba(255,255,255,.8)_1px,transparent_1.6px),radial-gradient(circle_at_72%_28%,rgba(34,211,238,.75)_1px,transparent_1.4px),radial-gradient(circle_at_48%_74%,rgba(139,92,246,.75)_1px,transparent_1.6px)] [background-size:120px_120px,180px_180px,160px_160px]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.13]" preserveAspectRatio="none" viewBox="0 0 1200 800">
        <path d="M80 620 C260 480 320 560 470 390 S780 320 1030 150" stroke="url(#desktop-line)" strokeWidth="1" fill="none" />
        <path d="M170 180 C340 230 380 120 520 240 S760 470 1060 420" stroke="url(#desktop-line)" strokeWidth="1" fill="none" />
        <defs>
          <linearGradient id="desktop-line" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_18%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,rgba(3,3,8,0.08),rgba(0,0,0,0.34))]" />
    </div>
  );
}

function TopMenuBar({
  activeView,
  motionEnabled,
  onCommandOpen,
  onMotionToggle,
  onThemeToggle,
  onViewChange,
  theme,
}: {
  activeView: FelipeOSView;
  motionEnabled: boolean;
  onCommandOpen: () => void;
  onMotionToggle: () => void;
  onThemeToggle: () => void;
  onViewChange: (view: FelipeOSView) => void;
  theme: "dark" | "light";
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[color:var(--fos-border)] bg-[var(--fos-surface)] px-3 py-1.5 shadow-[0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl sm:px-5">
      <div className="flex h-8 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="group flex min-w-0 items-center gap-2 rounded-full px-1.5 py-1 text-left outline-none transition hover:bg-[var(--fos-surface-glass)] focus-visible:bg-[var(--fos-surface-glass)]"
            onClick={() => onViewChange("command")}
            type="button"
          >
            <FelipeOSWordmark />
          </button>

          <nav aria-label="FelipeOS apps" className="hidden min-w-0 gap-1 overflow-x-auto lg:flex">
            {navItems.map((item) => (
              <button
                aria-current={activeView === item.id ? "page" : undefined}
                className={`relative rounded-full px-2.5 py-1.5 text-xs font-medium outline-none transition ${
                  activeView === item.id
                    ? "text-[var(--fos-text)]"
                    : "text-[var(--fos-muted)] hover:text-[var(--fos-text)] focus-visible:text-[var(--fos-text)]"
                }`}
                key={item.id}
                onClick={() => onViewChange(item.id)}
                type="button"
              >
                {item.label}
                {activeView === item.id ? (
                  <motion.span
                    className="absolute inset-x-2 -bottom-0.5 h-px rounded-full bg-[linear-gradient(90deg,var(--fos-purple),var(--fos-cyan))] shadow-[0_0_14px_var(--fos-cyan)]"
                    layoutId="top-menu-active-line"
                  />
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-100 sm:flex">
            <motion.span
              animate={motionEnabled ? { opacity: [0.45, 1, 0.45] } : { opacity: 1 }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--fos-green)] shadow-[0_0_12px_rgba(52,211,153,0.55)]"
              transition={{ duration: 2, repeat: Infinity }}
            />
            Available for builds & advisory
          </span>
          <span className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1.5 text-xs font-medium text-emerald-100 sm:hidden">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--fos-green)]" />
            Available
          </span>
          <button
            aria-label="Toggle theme"
            className="grid h-8 w-8 place-items-center rounded-full border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] text-[var(--fos-muted)] outline-none transition hover:text-[var(--fos-text)] focus-visible:text-[var(--fos-text)]"
            onClick={onThemeToggle}
            type="button"
          >
            {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </button>
          <button
            aria-label={motionEnabled ? "Reduce ambient motion" : "Enable ambient motion"}
            className="grid h-8 w-8 place-items-center rounded-full border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] text-[var(--fos-muted)] outline-none transition hover:text-[var(--fos-text)] focus-visible:text-[var(--fos-text)]"
            onClick={onMotionToggle}
            type="button"
          >
            <Activity className={`h-3.5 w-3.5 ${motionEnabled ? "text-[var(--fos-cyan)]" : ""}`} />
          </button>
          <button
            aria-label="Open Hey Felipe command app"
            className="grid h-8 w-8 place-items-center rounded-full border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] text-[var(--fos-muted)] outline-none transition hover:border-cyan-300/30 hover:text-[var(--fos-text)] focus-visible:border-cyan-200/50"
            onClick={onCommandOpen}
            type="button"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <a aria-label="LinkedIn" className="hidden h-8 w-8 place-items-center rounded-full border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] text-[var(--fos-muted)] transition hover:border-cyan-300/30 hover:text-[var(--fos-text)] md:grid" href={LINKEDIN} rel="noopener noreferrer" target="_blank">
            <span className="text-[0.68rem] font-bold">in</span>
          </a>
          <a aria-label="GitHub" className="hidden h-8 w-8 place-items-center rounded-full border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] text-[var(--fos-muted)] transition hover:border-cyan-300/30 hover:text-[var(--fos-text)] md:grid" href={GITHUB} rel="noopener noreferrer" target="_blank">
            <Code2 className="h-3.5 w-3.5" />
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
  motionEnabled: boolean;
  onActiveCaseChange: (id: CaseStudyId) => void;
  onActiveSystemChange: (id: SystemId) => void;
  onFocusModeChange: (value: boolean) => void;
  onIntent: (intent: RouteIntent) => void;
  onViewChange: (view: FelipeOSView) => void;
  publicCV: PublicCVData;
}) {
  return (
    <div className={`relative z-10 flex min-h-screen flex-col px-3 pb-24 pt-14 sm:px-5 lg:pl-8 ${props.focusMode ? "lg:pr-8" : "lg:pr-[23.5rem]"}`}>
      {!props.focusMode ? (
        <>
          <DashboardWidgetStack
            activeCaseId={props.activeCaseId}
            activeView={props.activeView}
            motionEnabled={props.motionEnabled}
            onViewChange={props.onViewChange}
            publicCV={props.publicCV}
          />
          <MobileWidgetStrip
            activeCaseId={props.activeCaseId}
            activeView={props.activeView}
            publicCV={props.publicCV}
          />
        </>
      ) : null}

      <MainAppWindow
        activeCaseId={props.activeCaseId}
        activeSystemId={props.activeSystemId}
        activeView={props.activeView}
        focusMode={props.focusMode}
        motionEnabled={props.motionEnabled}
        onActiveCaseChange={props.onActiveCaseChange}
        onActiveSystemChange={props.onActiveSystemChange}
        onClose={() => props.onViewChange("command")}
        onFocusModeChange={props.onFocusModeChange}
        onIntent={props.onIntent}
        onViewChange={props.onViewChange}
        publicCV={props.publicCV}
      />

      {!props.focusMode ? <BottomDock activeView={props.activeView} onViewChange={props.onViewChange} /> : null}
    </div>
  );
}

function MainAppWindow(props: {
  activeCaseId: CaseStudyId;
  activeSystemId: SystemId;
  activeView: FelipeOSView;
  focusMode: boolean;
  motionEnabled: boolean;
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
    <div className={`relative mt-3 sm:mt-5 ${props.focusMode ? "max-w-none" : "mx-auto w-full max-w-5xl lg:mx-0 lg:w-[min(64vw,980px)]"}`}>
      {!props.focusMode ? <LayeredInactiveWindows motionEnabled={props.motionEnabled} /> : null}
      <AppWindow
        active
        appId={props.activeView}
        onClose={props.activeView !== "command" ? props.onClose : undefined}
        onFocus={() => props.onFocusModeChange(!props.focusMode)}
        subtitle={meta.context}
        title={meta.title}
        variant={props.focusMode ? "focus" : "default"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.965, x: -18, y: 18 }}
            initial={{ opacity: 0, scale: 0.975, x: 18, y: 18 }}
            key={props.activeView}
            transition={{
              damping: props.motionEnabled ? 28 : 100,
              duration: props.motionEnabled ? undefined : 0.01,
              stiffness: 240,
              type: "spring",
            }}
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
      </AppWindow>
    </div>
  );
}

function AppWindow({
  appId,
  children,
  onClose,
  onFocus,
  subtitle,
  title,
  variant,
}: {
  active: boolean;
  appId: FelipeOSView;
  children: ReactNode;
  onClose?: () => void;
  onFocus: () => void;
  subtitle: string;
  title: string;
  variant: "default" | "focus";
}) {
  return (
    <motion.section
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`relative z-10 flex min-h-[calc(100vh-10rem)] w-full flex-col overflow-hidden rounded-[26px] border border-[color:var(--fos-border)] bg-[var(--fos-surface)] shadow-[0_30px_120px_rgba(0,0,0,0.48)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:rounded-[26px] before:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_28%,rgba(34,211,238,0.04)_70%,transparent)] before:content-[''] sm:min-h-[calc(100vh-10rem)] ${
        variant === "focus" ? "min-h-[calc(100vh-7rem)]" : ""
      }`}
      initial={{ opacity: 0, scale: 0.975, y: 18 }}
      key={`window-${appId}`}
      transition={{ damping: 30, stiffness: 250, type: "spring" }}
    >
      <div className="relative z-10 flex min-h-14 items-center justify-between gap-3 border-b border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] px-4 py-3">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-[var(--fos-text)] sm:text-base">{title}</h1>
          <p className="hidden truncate text-xs text-[var(--fos-muted)] sm:block">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] px-3 py-1.5 text-xs font-medium text-[var(--fos-muted)] transition hover:text-[var(--fos-text)]"
            onClick={onFocus}
            type="button"
          >
            {variant === "focus" ? "Exit focus" : "Focus"}
          </button>
          {onClose ? (
            <button
              className="rounded-full border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] px-3 py-1.5 text-xs font-medium text-[var(--fos-muted)] transition hover:text-[var(--fos-text)]"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] sm:px-5 sm:py-5 [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </motion.section>
  );
}

function LayeredInactiveWindows({ motionEnabled }: { motionEnabled: boolean }) {
  const layers = [
    { label: "Dashboard", x: 28, y: 24, rotate: 2, tone: "cyan" },
    { label: "Workflow", x: 52, y: 50, rotate: -2, tone: "purple" },
    { label: "Timeline", x: 78, y: 78, rotate: 1.5, tone: "green" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden translate-x-10 translate-y-8 lg:block">
      {layers.map((layer, index) => (
        <motion.div
          animate={motionEnabled ? { y: [layer.y, layer.y + 4, layer.y] } : { y: layer.y }}
          className="absolute h-[72%] w-[84%] rounded-[26px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] opacity-[0.28] shadow-[0_24px_80px_rgba(0,0,0,0.35)] blur-[0.2px] backdrop-blur-xl"
          key={layer.label}
          style={{ left: layer.x, top: layer.y, rotate: `${layer.rotate}deg` }}
          transition={{ delay: index * 0.4, duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          <div className="flex h-10 items-center justify-between border-b border-[color:var(--fos-border)] px-4">
            <span className="text-xs font-semibold text-[var(--fos-muted)]">{layer.label}</span>
            <span className={`h-1.5 w-12 rounded-full ${layer.tone === "cyan" ? "bg-cyan-300/40" : layer.tone === "purple" ? "bg-purple-400/40" : "bg-emerald-300/40"}`} />
          </div>
          <div className="grid gap-3 p-4">
            <span className="h-16 rounded-2xl bg-white/[0.055]" />
            <span className="h-3 w-2/3 rounded-full bg-white/[0.08]" />
            <span className="h-3 w-1/2 rounded-full bg-white/[0.06]" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DashboardWidgetStack({
  activeCaseId,
  activeView,
  motionEnabled,
  onViewChange,
  publicCV,
}: {
  activeCaseId: CaseStudyId;
  activeView: FelipeOSView;
  motionEnabled: boolean;
  onViewChange: (view: FelipeOSView) => void;
  publicCV: PublicCVData;
}) {
  const selectedCase = caseStudies.find((study) => study.id === activeCaseId) ?? caseStudies[0];
  const contextDetail =
    activeView === "services"
      ? ["Most requested", "AI Workflow Sprint", "Growth Audit", "AI Assistant Build"]
      : activeView === "case-studies"
        ? [selectedCase.category, selectedCase.title, selectedCase.capabilities.slice(0, 2).join(" / ")]
        : activeView === "cv"
          ? ["Public profile", "12+ years", `${publicCV.languages?.length || 3} languages`, "Download CV"]
          : [viewMeta[activeView].title, viewMeta[activeView].context];

  return (
    <aside className="fixed bottom-28 right-6 top-16 z-20 hidden w-[320px] content-start gap-4 overflow-y-auto [scrollbar-width:none] lg:grid [&::-webkit-scrollbar]:hidden">
      <section className="rounded-[24px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-100/70">Status</p>
          <motion.span
            animate={motionEnabled ? { opacity: [0.45, 1, 0.45], scale: [0.95, 1.14, 0.95] } : undefined}
            className="h-2 w-2 rounded-full bg-[var(--fos-green)] shadow-[0_0_18px_rgba(52,211,153,0.62)]"
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </div>
        <h2 className="mt-3 text-xl font-semibold text-[var(--fos-text)]">Open for builds</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--fos-muted)]">Product / Growth / AI systems</p>
        <p className="text-sm text-[var(--fos-muted)]">Paris / Remote</p>
        <button
          className="mt-4 cursor-pointer rounded-full bg-[var(--fos-text)] px-4 py-2 text-xs font-semibold text-[var(--fos-bg)] transition hover:-translate-y-0.5"
          onClick={() => onViewChange("contact")}
          type="button"
        >
          Contact →
        </button>
      </section>

      <section className="rounded-[24px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/60">Impact</p>
          <MiniSparkline motionEnabled={motionEnabled} />
        </div>
        <div className="mt-4 grid gap-2">
          {proofMetrics.map(([value, label]) => (
            <div className="flex items-center justify-between rounded-2xl border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] px-3 py-2" key={value}>
              <p className="text-sm font-semibold text-[var(--fos-text)]">{value}</p>
              <p className="text-xs leading-5 text-[var(--fos-muted)]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-4 backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-purple-100/60">Context</p>
        <h2 className="mt-3 text-lg font-semibold text-[var(--fos-text)]">{contextDetail[0]}</h2>
        <div className="mt-3 grid gap-2">
          {contextDetail.slice(1).map((item) => (
            <p className="rounded-2xl border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] px-3 py-2 text-xs leading-5 text-[var(--fos-muted)]" key={item}>
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-4 backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/60">System activity</p>
        <div className="mt-4 grid gap-2">
          {[
            ["APIs", "70%"],
            ["Automation", "86%"],
            ["Dashboards", "64%"],
            ["Growth", "78%"],
          ].map(([item, width]) => (
            <div className="rounded-2xl border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] px-3 py-2" key={item}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--fos-text)]">{item}</span>
                <motion.span
                  animate={motionEnabled ? { opacity: [0.45, 1, 0.45] } : undefined}
                  className="h-2 w-2 rounded-full bg-[var(--fos-cyan)]"
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.span
                  animate={motionEnabled ? { width } : { width }}
                  className="block h-full rounded-full bg-[linear-gradient(90deg,var(--fos-purple),var(--fos-cyan))]"
                  initial={{ width: "20%" }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
              />
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function MobileWidgetStrip({
  activeCaseId,
  activeView,
  publicCV,
}: {
  activeCaseId: CaseStudyId;
  activeView: FelipeOSView;
  publicCV: PublicCVData;
}) {
  const selectedCase = caseStudies.find((study) => study.id === activeCaseId) ?? caseStudies[0];
  const context = activeView === "case-studies" ? selectedCase.title : viewMeta[activeView].context;

  return (
    <div className="-mx-3 mb-2 flex gap-2 overflow-x-auto px-3 pt-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
      {[
        ["Status", "Paris / Remote"],
        ["Impact", "+25% conversion"],
        ["Context", context],
        ["CV", `${publicCV.languages?.length || 3} languages`],
      ].map(([title, value]) => (
        <div className="min-w-[11rem] rounded-[18px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-3 backdrop-blur-xl" key={title}>
          <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--fos-muted)]">{title}</p>
          <p className="mt-1 truncate text-sm font-semibold text-[var(--fos-text)]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function MiniSparkline({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <svg aria-hidden="true" className="h-8 w-24" viewBox="0 0 96 32">
      <motion.path
        animate={motionEnabled ? { pathLength: [0.3, 1, 0.3] } : { pathLength: 1 }}
        d="M4 24 C16 8 24 18 34 14 S48 6 58 12 70 26 92 8"
        fill="none"
        stroke="url(#sparkline-gradient)"
        strokeLinecap="round"
        strokeWidth="2"
        transition={{ duration: 4, repeat: Infinity }}
      />
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" x2="96" y1="0" y2="0">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BottomDock({ activeView, onViewChange }: { activeView: FelipeOSView; onViewChange: (view: FelipeOSView) => void }) {
  return (
    <nav aria-label="FelipeOS dock" className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 pb-[env(safe-area-inset-bottom)]">
      <div className="flex max-w-full gap-2 overflow-x-auto rounded-[28px] border border-[color:var(--fos-border)] bg-[var(--fos-surface)] p-2 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {dockItems.map((item) => {
          const active = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className={`group relative grid h-12 min-h-12 min-w-12 cursor-pointer place-items-center rounded-[20px] border px-3 text-left outline-none transition ${
                active
                  ? "border-cyan-300/35 bg-cyan-300/10 text-[var(--fos-text)] shadow-[0_0_28px_rgba(34,211,238,0.16)]"
                  : "border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] text-[var(--fos-muted)] hover:-translate-y-1 hover:scale-110 hover:border-purple-300/35 hover:text-[var(--fos-text)] focus-visible:border-cyan-200/50"
              }`}
              key={item.id}
              onClick={() => onViewChange(item.id)}
              type="button"
            >
              <span className="grid h-8 w-8 flex-none place-items-center rounded-2xl bg-white/[0.07] text-[var(--fos-text)]">
                {item.id === "command" ? <FelipeOSLogo size={24} /> : <Icon className="h-4 w-4" />}
              </span>
              <span className="pointer-events-none absolute -top-9 hidden whitespace-nowrap rounded-full border border-[color:var(--fos-border)] bg-[var(--fos-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--fos-text)] shadow-[0_10px_28px_rgba(0,0,0,0.28)] group-hover:block max-sm:hidden">
                {item.label}
              </span>
              {active ? <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-[var(--fos-cyan)] shadow-[0_0_14px_var(--fos-cyan)]" /> : null}
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
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Operating layer</p>
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
    <section className="rounded-[22px] border border-white/10 bg-black/30 p-4 sm:p-5">
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
          <article className="rounded-[20px] border border-white/10 bg-black/30 p-5" key={service.title}>
            <p className="text-xs uppercase tracking-[0.16em] text-purple-100/55">Service {index + 1}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{service.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{service.description}</p>
            <ServiceVisual title={service.title} />
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

function ServiceVisual({ title }: { title: string }) {
  if (title.includes("Growth")) {
    return (
      <div className="mt-5 rounded-[18px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-4">
        <div className="flex items-end gap-2">
          {[34, 52, 44, 70, 62, 86].map((height, index) => (
            <span
              className="flex-1 rounded-t-lg bg-[linear-gradient(180deg,var(--fos-cyan),var(--fos-purple))]"
              key={height}
              style={{ height: `${height}px`, opacity: 0.42 + index * 0.07 }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[0.64rem] uppercase tracking-[0.12em] text-[var(--fos-muted)]">
          <span>Spend</span>
          <span>Signal</span>
          <span>Tests</span>
        </div>
      </div>
    );
  }

  if (title.includes("Assistant")) {
    return (
      <div className="mt-5 grid gap-2 rounded-[18px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-4">
        <div className="mr-8 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs text-slate-200">Classify ticket + retrieve policy</div>
        <div className="ml-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100">Draft answer, flag human review</div>
        <div className="mr-12 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">Handoff ready</div>
      </div>
    );
  }

  if (title.includes("MVP")) {
    return (
      <div className="mt-5 rounded-[18px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-3">
        <div className="rounded-2xl border border-white/10 bg-black/25">
          <div className="flex h-8 items-center gap-2 border-b border-white/10 px-3">
            <span className="h-2 w-2 rounded-full bg-purple-300/70" />
            <span className="h-2 w-16 rounded-full bg-white/15" />
          </div>
          <div className="grid grid-cols-[0.7fr_1.3fr] gap-3 p-3">
            <span className="h-24 rounded-xl bg-white/[0.055]" />
            <div className="grid gap-2">
              <span className="h-8 rounded-xl bg-cyan-300/10" />
              <span className="h-8 rounded-xl bg-purple-400/10" />
              <span className="h-8 rounded-xl bg-white/[0.055]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-[18px] border border-[color:var(--fos-border)] bg-[var(--fos-surface-glass)] p-4">
      <div className="grid grid-cols-4 items-center gap-2">
        {["Audit", "Map", "Agent", "Ship"].map((step, index) => (
          <div className="relative" key={step}>
            <div className="grid h-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-xs font-semibold text-slate-200">
              {step}
            </div>
            {index < 3 ? <span className="absolute left-full top-1/2 h-px w-2 bg-cyan-300/40" /> : null}
          </div>
        ))}
      </div>
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
      <section className="rounded-[20px] border border-white/10 bg-black/30 p-4">
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
              active.id === study.id ? "bg-cyan-300/10 text-white" : "text-slate-400 hover:bg-white/[0.055] hover:text-slate-100"
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
            <article className="rounded-[20px] border border-white/10 bg-black/30 p-4">
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
        <div className="rounded-[20px] border border-white/10 bg-black/30 p-4 lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/60">Achievements</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(publicCV.selectedAchievements || []).map((achievement) => (
              <p className="rounded-2xl border border-white/[0.075] bg-white/[0.035] p-3 text-sm leading-6 text-slate-200" key={achievement}>
                {achievement}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] border border-white/10 bg-black/30 p-4">
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
        <div className="rounded-[20px] border border-white/10 bg-black/30 p-4">
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
        <div className="rounded-[20px] border border-white/10 bg-black/30 p-4">
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
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Fast routing for services, proof, systems, CV and contact.
          <span className="hidden sm:inline"> Cmd/Ctrl + K opens this app.</span>
        </p>
      </section>

      <div className="max-h-72 overflow-y-auto rounded-[22px] border border-white/10 bg-white/[0.035] p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid gap-3">
          {messages.slice(-8).map((message, index) => (
            <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`} key={`${message.role}-${index}-${message.text}`}>
              <p className={`max-w-[86%] rounded-2xl border px-3 py-2.5 text-sm leading-6 ${message.role === "user" ? "border-cyan-300/20 bg-cyan-300/10 text-white" : "border-white/10 bg-black/30 text-slate-100"}`}>
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
