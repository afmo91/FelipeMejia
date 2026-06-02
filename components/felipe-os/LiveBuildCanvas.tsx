"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { StagePreview } from "@/components/mockups";
import { caseStudies, type CaseStudyId } from "@/data/caseStudies";
import type { FelipeOSView } from "@/data/chatFlows";
import { services } from "@/data/services";
import { systems, type SystemId } from "@/data/systems";

type LiveBuildCanvasProps = {
  activeApp: FelipeOSView;
  bookingHref: string;
  bookingTarget?: "_blank";
  hidden: boolean;
  motionEnabled: boolean;
  selectedCaseStudy: CaseStudyId;
  selectedService: string;
  selectedSystem: SystemId;
};

const appStatus: Record<FelipeOSView, string> = {
  command: "Operating layer ready",
  services: "Commercial route configured",
  systems: "Workflow map compiled",
  "case-studies": "Representative mockup loaded",
  experience: "Career signal compiled",
  cv: "Download-ready profile",
  "hey-felipe": "Command output linked",
  contact: "Discovery route open",
};

const commandNodes = ["AI Assistants", "Agentic Workflows", "Automation & APIs", "Growth Systems", "Product Dashboards"];
const commandFeed = ["mapping workflow", "connecting APIs", "instrumenting metrics", "generating operating layer"];

const systemFlows: Record<SystemId, string[]> = {
  "ai-assistants": ["Intake", "Assistant", "Knowledge base", "Response draft", "Human review", "Analytics"],
  "agentic-workflows": ["Trigger", "Agent", "CRM/API", "Human approval", "Dashboard", "Follow-up"],
  "automation-integrations": ["App event", "Webhook", "API router", "Data sync", "Ops dashboard", "Alert"],
  "growth-systems": ["Traffic", "Attribution", "Funnel", "Experiment", "Decision", "Next test"],
  "product-dashboards": ["Data source", "KPI tiles", "Decision panel", "Owner action", "Status", "Follow-up"],
  "product-builds": ["Scope", "UX flow", "MVP build", "Deploy", "Measure", "Iterate"],
};

function useDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function CanvasFrame({
  children,
  motionEnabled,
  status,
}: {
  children: ReactNode;
  motionEnabled: boolean;
  status: string;
}) {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(7,10,20,0.72)] shadow-[0_24px_90px_rgba(0,0,0,0.44)] backdrop-blur-2xl">
      <motion.div
        animate={motionEnabled ? { opacity: [0.22, 0.38, 0.22], x: [-8, 10, -8] } : { opacity: 0.25 }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_28%_0%,rgba(139,92,246,0.32),transparent_58%),radial-gradient(circle_at_82%_8%,rgba(34,211,238,0.22),transparent_48%)]"
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 border-b border-white/10 px-4 py-3">
        <p className="text-[0.64rem] uppercase tracking-[0.18em] text-cyan-100/60">Live Build Canvas</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white">{status}</p>
          <span className="h-2 w-2 rounded-full bg-[var(--fos-green)] shadow-[0_0_14px_rgba(52,211,153,0.58)]" />
        </div>
      </div>
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}

function TerminalFeed({ lines, motionEnabled }: { lines: string[]; motionEnabled: boolean }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black/30 p-3 font-mono text-[0.68rem] text-cyan-100/70">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-purple-300/70" />
      </div>
      <div className="grid gap-1.5">
        {lines.map((line, index) => (
          <motion.span
            animate={motionEnabled ? { opacity: [0.42, 1, 0.42] } : { opacity: 0.78 }}
            key={line}
            transition={{ delay: index * 0.18, duration: 2.2, repeat: Infinity }}
          >
            &gt; {line}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function CommandCanvas({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <div className="grid gap-4">
      <div className="relative min-h-[24rem] overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,0.16),rgba(139,92,246,0.12)_42%,rgba(255,255,255,0.025)_68%)] p-4">
        <div className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:34px_34px]" />
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 320 352">
          {[
            "M160 164 L160 58",
            "M160 164 L64 118",
            "M160 164 L256 118",
            "M160 164 L90 265",
            "M160 164 L242 265",
          ].map((d, index) => (
            <motion.path
              animate={motionEnabled ? { pathLength: [0.15, 1, 0.15], opacity: [0.24, 0.72, 0.24] } : { pathLength: 1, opacity: 0.46 }}
              d={d}
              fill="none"
              initial={{ opacity: 0.46, pathLength: 1 }}
              key={d}
              stroke={index % 2 ? "#8b5cf6" : "#22d3ee"}
              strokeLinecap="round"
              strokeWidth="1.4"
              transition={{ delay: index * 0.18, duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>
        <div className="relative z-10 min-h-[22rem]">
          <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-300/25 bg-black/45 text-center shadow-[0_0_42px_rgba(34,211,238,0.16)]">
            <div>
              <p className="text-sm font-semibold text-white">Felipe OS</p>
              <p className="mt-1 text-[0.64rem] uppercase tracking-[0.12em] text-cyan-100/60">core</p>
            </div>
          </div>
          <div className="absolute inset-0">
            {commandNodes.map((node, index) => {
              const positions = [
                "left-1/2 top-2 -translate-x-1/2",
                "left-1 top-[4.25rem]",
                "right-1 top-[4.25rem]",
                "bottom-[5.25rem] left-2",
                "bottom-3 right-2",
              ];
              return (
                <div
                  className={`absolute w-[6.1rem] rounded-2xl border border-white/10 bg-white/[0.055] px-2 py-2 text-center text-[0.64rem] font-semibold leading-4 text-slate-100 shadow-[0_14px_34px_rgba(0,0,0,0.22)] ${positions[index]}`}
                  key={node}
                >
                  {node}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <TerminalFeed lines={commandFeed} motionEnabled={motionEnabled} />
    </div>
  );
}

function ServicesCanvas({
  bookingHref,
  bookingTarget,
  selectedService,
}: {
  bookingHref: string;
  bookingTarget?: "_blank";
  selectedService: (typeof services)[number];
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        {["Choose service", "Define problem", "Scope system", "Book 30-min call"].map((step, index) => (
          <div className="grid grid-cols-[2rem_1fr] items-center gap-3" key={step}>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-xs font-semibold text-cyan-50">
              {index + 1}
            </span>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <p className="text-sm font-semibold text-white">{step}</p>
            </div>
          </div>
        ))}
      </div>
      <section className="rounded-[20px] border border-emerald-300/15 bg-emerald-300/[0.06] p-4">
        <p className="text-[0.64rem] uppercase tracking-[0.16em] text-emerald-100/60">Selected service</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{selectedService.title}</h3>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2">
          <span className="text-[0.68rem] uppercase tracking-[0.14em] text-slate-400">Timeline</span>
          <span className="text-sm font-semibold text-white">{selectedService.timeline}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedService.deliverables.slice(0, 4).map((deliverable) => (
            <span className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[0.68rem] text-slate-200" key={deliverable}>
              {deliverable}
            </span>
          ))}
        </div>
        <a
          className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-100"
          href={bookingHref}
          rel={bookingTarget ? "noopener noreferrer" : undefined}
          target={bookingTarget}
        >
          Start this project
        </a>
      </section>
    </div>
  );
}

function SystemsCanvas({ motionEnabled, selectedSystem }: { motionEnabled: boolean; selectedSystem: (typeof systems)[number] }) {
  const flow = systemFlows[selectedSystem.id] || systemFlows["agentic-workflows"];

  return (
    <div className="grid gap-4">
      <div className="rounded-[22px] border border-white/10 bg-black/25 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.64rem] uppercase tracking-[0.16em] text-purple-100/60">Selected system</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{selectedSystem.title}</h3>
          </div>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[0.68rem] text-cyan-100">
            {selectedSystem.signal}
          </span>
        </div>
        <div className="relative mt-5 grid gap-3">
          {flow.map((node, index) => (
            <div className="relative grid grid-cols-[2rem_1fr] items-center gap-3" key={`${selectedSystem.id}-${node}`}>
              {index < flow.length - 1 ? <span className="absolute left-4 top-8 h-7 w-px bg-cyan-300/20" /> : null}
              <motion.span
                animate={motionEnabled ? { boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 18px rgba(34,211,238,0.28)", "0 0 0 rgba(34,211,238,0)"] } : undefined}
                className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-[0.68rem] font-semibold text-cyan-50"
                transition={{ delay: index * 0.14, duration: 2.4, repeat: Infinity }}
              >
                {index + 1}
              </motion.span>
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
                <p className="text-sm font-semibold text-white">{node}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TerminalFeed lines={["trigger received", "agent step queued", "approval checkpoint", "dashboard updated"]} motionEnabled={motionEnabled} />
    </div>
  );
}

function ProofCanvas({ selectedCaseStudy }: { selectedCaseStudy: (typeof caseStudies)[number] }) {
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/30">
        <StagePreview className="min-h-[18rem]" mockup={selectedCaseStudy.mockup} />
      </div>
      <section className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
        <p className="text-[0.64rem] uppercase tracking-[0.16em] text-cyan-100/60">Safe representative mockup</p>
        <h3 className="mt-2 text-lg font-semibold text-white">{selectedCaseStudy.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{selectedCaseStudy.commercialValue}</p>
      </section>
    </div>
  );
}

function ExperienceCanvas() {
  const timeline = ["Segmentta", "Adamo", "Spotz.pro", "AI Systems / Consulting"];
  const metrics = ["12+ years", "€3M+ budget", "+25% conversion", "-30% CAC", "€200K+ recovered"];

  return (
    <div className="grid gap-4">
      <div className="rounded-[22px] border border-white/10 bg-black/25 p-4">
        <div className="relative grid gap-3">
          {timeline.map((item, index) => (
            <div className="relative grid grid-cols-[1.4rem_1fr] gap-3" key={item}>
              {index < timeline.length - 1 ? <span className="absolute left-[0.43rem] top-5 h-9 w-px bg-purple-300/25" /> : null}
              <span className="relative z-10 mt-1 h-3.5 w-3.5 rounded-full border border-purple-200/40 bg-purple-300/35 shadow-[0_0_18px_rgba(139,92,246,0.22)]" />
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
                <p className="text-sm font-semibold text-white">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric) => (
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3" key={metric}>
            <p className="text-sm font-semibold text-white">{metric}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CVCanvas({ publicHighlights }: { publicHighlights: string[] }) {
  return (
    <div className="grid gap-4">
      <div className="mx-auto w-full max-w-[13rem] rounded-[16px] bg-white p-4 text-slate-950 shadow-[0_20px_55px_rgba(0,0,0,0.28)]">
        <div className="h-3 w-24 rounded-full bg-slate-900" />
        <div className="mt-3 h-2 w-32 rounded-full bg-slate-300" />
        <div className="mt-5 grid gap-1.5">
          <span className="h-1.5 rounded-full bg-slate-700" />
          <span className="h-1.5 rounded-full bg-slate-300" />
          <span className="h-1.5 w-4/5 rounded-full bg-slate-300" />
        </div>
        <div className="mt-5 grid gap-2">
          {[0, 1, 2].map((item) => (
            <div className="rounded-lg border border-slate-200 p-2" key={item}>
              <span className="block h-1.5 w-20 rounded-full bg-slate-800" />
              <span className="mt-1.5 block h-1.5 rounded-full bg-slate-300" />
            </div>
          ))}
        </div>
      </div>
      <section className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
        <p className="text-[0.64rem] uppercase tracking-[0.16em] text-cyan-100/60">Public CV</p>
        <div className="mt-3 grid gap-2">
          {publicHighlights.slice(0, 3).map((highlight) => (
            <p className="border-l border-cyan-300/35 pl-3 text-xs leading-5 text-slate-300" key={highlight}>
              {highlight}
            </p>
          ))}
        </div>
        <a className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-100" download href="/api/download/cv">
          Download CV
        </a>
      </section>
    </div>
  );
}

function ContactCanvas({ bookingHref, bookingTarget }: { bookingHref: string; bookingTarget?: "_blank" }) {
  return (
    <div className="grid gap-4">
      <section className="rounded-[22px] border border-emerald-300/15 bg-emerald-300/[0.07] p-4">
        <p className="text-[0.64rem] uppercase tracking-[0.16em] text-emerald-100/60">Booking route</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Book a 30-min discovery call</h3>
        <p className="mt-2 text-sm leading-6 text-emerald-50/80">Mon-Fri, Paris working hours.</p>
        <div className="mt-4 grid gap-2">
          {["AI workflow", "Growth system", "Assistant build", "Product / MVP"].map((item) => (
            <span className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" key={item}>
              {item}
            </span>
          ))}
        </div>
        <a
          className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-100"
          href={bookingHref}
          rel={bookingTarget ? "noopener noreferrer" : undefined}
          target={bookingTarget}
        >
          Book on Google Calendar
        </a>
      </section>
    </div>
  );
}

function HeyFelipeCanvas({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-[22px] border border-white/10 bg-black/25 p-4">
        <p className="text-[0.64rem] uppercase tracking-[0.16em] text-purple-100/60">Assistant output</p>
        <div className="mt-4 grid gap-3">
          {["Intent", "Route app", "Update canvas", "Suggest next action"].map((step, index) => (
            <motion.div
              animate={motionEnabled ? { opacity: [0.58, 1, 0.58] } : { opacity: 0.86 }}
              className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-white"
              key={step}
              transition={{ delay: index * 0.16, duration: 2.4, repeat: Infinity }}
            >
              {step}
            </motion.div>
          ))}
        </div>
      </div>
      <TerminalFeed lines={["waiting for prompt", "routing visual output", "keeping answer concise"]} motionEnabled={motionEnabled} />
    </div>
  );
}

function CanvasContent({
  activeApp,
  bookingHref,
  bookingTarget,
  motionEnabled,
  selectedCaseStudy,
  selectedService,
  selectedSystem,
}: Omit<LiveBuildCanvasProps, "hidden">) {
  const system = systems.find((item) => item.id === selectedSystem) ?? systems[0];
  const study = caseStudies.find((item) => item.id === selectedCaseStudy) ?? caseStudies[0];
  const service = services.find((item) => item.title === selectedService) ?? services[0];

  if (activeApp === "services") {
    return <ServicesCanvas bookingHref={bookingHref} bookingTarget={bookingTarget} selectedService={service} />;
  }
  if (activeApp === "systems") {
    return <SystemsCanvas motionEnabled={motionEnabled} selectedSystem={system} />;
  }
  if (activeApp === "case-studies") {
    return <ProofCanvas selectedCaseStudy={study} />;
  }
  if (activeApp === "experience") {
    return <ExperienceCanvas />;
  }
  if (activeApp === "cv") {
    return <CVCanvas publicHighlights={["12+ years across product, growth and AI systems.", "€3M+ annual media budget managed.", "+25% conversion and -30% CAC from experimentation."]} />;
  }
  if (activeApp === "contact") {
    return <ContactCanvas bookingHref={bookingHref} bookingTarget={bookingTarget} />;
  }
  if (activeApp === "hey-felipe") {
    return <HeyFelipeCanvas motionEnabled={motionEnabled} />;
  }
  return <CommandCanvas motionEnabled={motionEnabled} />;
}

export default function LiveBuildCanvas({
  activeApp,
  bookingHref,
  bookingTarget,
  hidden,
  motionEnabled,
  selectedCaseStudy,
  selectedService,
  selectedSystem,
}: LiveBuildCanvasProps) {
  const isDesktop = useDesktopViewport();
  const [mobileOpen, setMobileOpen] = useState(false);
  const selectionKey = useMemo(
    () => `${activeApp}:${selectedSystem}:${selectedCaseStudy}:${selectedService}`,
    [activeApp, selectedCaseStudy, selectedService, selectedSystem],
  );
  const previousSelectionKey = useRef(selectionKey);

  useEffect(() => {
    if (previousSelectionKey.current === selectionKey) return;
    previousSelectionKey.current = selectionKey;
    if (!isDesktop && ["services", "systems", "case-studies"].includes(activeApp)) {
      setMobileOpen(true);
    }
  }, [activeApp, isDesktop, selectionKey]);

  const content = (
    <CanvasFrame motionEnabled={motionEnabled} status={appStatus[activeApp]}>
      <CanvasContent
        activeApp={activeApp}
        bookingHref={bookingHref}
        bookingTarget={bookingTarget}
        motionEnabled={motionEnabled}
        selectedCaseStudy={selectedCaseStudy}
        selectedService={selectedService}
        selectedSystem={selectedSystem}
      />
    </CanvasFrame>
  );

  if (hidden) return null;

  return (
    <>
      <aside className="fixed bottom-24 right-5 top-14 z-30 hidden w-[330px] lg:block">{content}</aside>

      <div className="fixed bottom-24 right-3 z-50 lg:hidden">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-[#090914]/90 px-4 py-2 text-sm font-semibold text-cyan-50 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          onClick={() => setMobileOpen(true)}
          type="button"
        >
          Preview
          <ChevronDown className="h-4 w-4 rotate-180" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-black/55 px-3 pb-3 pt-[25vh] backdrop-blur-sm lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.section
              animate={{ y: 0 }}
              className="flex h-[70vh] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#090914] shadow-[0_26px_90px_rgba(0,0,0,0.55)]"
              exit={{ y: 80 }}
              initial={{ y: 80 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="flex justify-end border-b border-white/10 p-3">
                <button
                  aria-label="Close Live Build Canvas"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-slate-200"
                  onClick={() => setMobileOpen(false)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 p-3">{content}</div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
