"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, EyeOff, MessageSquareText, Mic2, MicOff, Volume2, X } from "lucide-react";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { FelipeOSView } from "@/data/chatFlows";

const FelipeGuideModel = dynamic(() => import("@/components/felipe-os/FelipeGuideModel"), {
  ssr: false,
  loading: () => <GuideFallback copy="Loading guide..." />,
});

const guideCopy: Record<
  FelipeOSView,
  {
    title: string;
    message: string;
    terminal: string[];
    cta: "booking" | "services" | "proof" | "hey";
    audio: string;
  }
> = {
  command: {
    title: "Command Center",
    message:
      "Welcome to Felipe OS. I build AI-powered systems for growth, product and operations. Start with services, proof, or systems.",
    terminal: ["Mapping workflow...", "Connecting APIs...", "Generating dashboard..."],
    cta: "services",
    audio: "/audio/message-welcome.mp3",
  },
  services: {
    title: "Services",
    message: "Choose the system you want to build: workflow sprint, AI assistant, growth audit or product build.",
    terminal: ["Scoping deliverables...", "Matching timeline...", "Preparing discovery call..."],
    cta: "booking",
    audio: "/audio/message-consulting.mp3",
  },
  systems: {
    title: "Systems",
    message: "This is where process becomes software: agents, APIs, dashboards and workflows connected into one operating layer.",
    terminal: ["Resolving data sources...", "Routing decisions...", "Syncing workflow state..."],
    cta: "proof",
    audio: "/audio/message-exploring_process.mp3",
  },
  "case-studies": {
    title: "Proof of Work",
    message: "These are representative builds. The data is safe, but the systems reflect what I can design and ship.",
    terminal: ["Sanitizing mockups...", "Measuring impact...", "Highlighting capabilities..."],
    cta: "services",
    audio: "/audio/message-consulting_results.mp3",
  },
  experience: {
    title: "Experience",
    message: "The timeline shows product, growth and automation work under commercial pressure.",
    terminal: ["Reading career signal...", "Tracing operating roles...", "Extracting proof points..."],
    cta: "proof",
    audio: "/audio/message-exploring_story.mp3",
  },
  cv: {
    title: "Public CV",
    message: "My public CV is available here. For role-specific versions, I keep tailored files in the admin workspace.",
    terminal: ["Indexing experience...", "Formatting ATS profile...", "Preparing download..."],
    cta: "booking",
    audio: "/audio/message-cv.mp3",
  },
  "hey-felipe": {
    title: "Hey Felipe",
    message: "Use this command app to route quickly to services, proof, systems, CV or booking.",
    terminal: ["Listening for intent...", "Routing next action...", "Keeping answer concise..."],
    cta: "booking",
    audio: "/audio/message-connect.mp3",
  },
  contact: {
    title: "Contact",
    message:
      "If there is a workflow, growth problem or AI use case worth systemizing, book a 30-minute call.",
    terminal: ["Opening calendar...", "Framing discovery...", "Finding practical next step..."],
    cta: "booking",
    audio: "/audio/message-connect.mp3",
  },
};

class GuideErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <GuideFallback copy="3D guide unavailable. Text guide is active." />;
    return this.props.children;
  }
}

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

function GuideFallback({ copy }: { copy: string }) {
  return (
    <div className="grid h-full min-h-44 place-items-center rounded-[22px] border border-white/10 bg-black/25">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
          <MessageSquareText className="h-6 w-6" />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">{copy}</p>
      </div>
    </div>
  );
}

function ContextPreview({ activeView, motionEnabled }: { activeView: FelipeOSView; motionEnabled: boolean }) {
  const labels =
    activeView === "services"
      ? ["Service", "Problem", "Timeline", "Call"]
      : activeView === "systems"
        ? ["Input", "Agent", "API", "Dashboard"]
        : activeView === "case-studies"
          ? ["Problem", "System", "Value", "Mockup"]
          : activeView === "cv"
            ? ["CV", "ATS", "Skills", "PDF"]
            : ["Signal", "Workflow", "Build", "Metric"];

  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-3">
      <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.14em] text-slate-500">
        <span>Preview</span>
        <span>live</span>
      </div>
      <div className="relative mt-3 grid grid-cols-2 gap-2">
        {labels.map((label, index) => (
          <motion.div
            animate={motionEnabled ? { opacity: [0.62, 1, 0.62] } : { opacity: 0.8 }}
            className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2"
            key={label}
            transition={{ delay: index * 0.18, duration: 2.2, repeat: Infinity }}
          >
            <span className="block h-1.5 w-8 rounded-full bg-[linear-gradient(90deg,var(--fos-purple),var(--fos-cyan))]" />
            <span className="mt-2 block text-xs font-medium text-slate-200">{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GuideContent({
  activeView,
  bookingHref,
  bookingTarget,
  canLoadModel,
  motionEnabled,
  muted,
  onHide,
  onMutedChange,
  onOpenBooking,
  onViewChange,
}: {
  activeView: FelipeOSView;
  bookingHref: string;
  bookingTarget?: "_blank";
  canLoadModel: boolean;
  motionEnabled: boolean;
  muted: boolean;
  onHide: () => void;
  onMutedChange: (value: boolean) => void;
  onOpenBooking: () => void;
  onViewChange: (view: FelipeOSView) => void;
}) {
  const copy = guideCopy[activeView];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function playAudio() {
    if (muted) onMutedChange(false);
    audioRef.current?.pause();
    const audio = new Audio(copy.audio);
    audioRef.current = audio;
    audio.play().catch(() => undefined);
  }

  function toggleMute() {
    const next = !muted;
    onMutedChange(next);
    if (next) audioRef.current?.pause();
  }

  const cta =
    copy.cta === "booking"
      ? { label: "Book a 30-min call", action: onOpenBooking }
      : copy.cta === "proof"
        ? { label: "See proof of work", action: () => onViewChange("case-studies") }
        : copy.cta === "hey"
          ? { label: "Open Hey Felipe", action: () => onViewChange("hey-felipe") }
          : { label: "Explore services", action: () => onViewChange("services") };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.64rem] uppercase tracking-[0.16em] text-cyan-100/55">Guide panel</p>
          <h2 className="mt-1 text-lg font-semibold text-white">{copy.title}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            aria-label={muted ? "Unmute guide voice" : "Mute guide voice"}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-slate-300 transition hover:text-white"
            onClick={toggleMute}
            type="button"
          >
            {muted ? <MicOff className="h-3.5 w-3.5" /> : <Mic2 className="h-3.5 w-3.5" />}
          </button>
          <button
            aria-label="Hide guide"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-slate-300 transition hover:text-white"
            onClick={onHide}
            type="button"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative h-48 shrink-0 overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_48%_32%,rgba(34,211,238,0.16),rgba(139,92,246,0.12)_42%,rgba(0,0,0,0.18))] lg:h-56">
        {canLoadModel ? (
          <GuideErrorBoundary>
            <FelipeGuideModel activeView={activeView} motionEnabled={motionEnabled} />
          </GuideErrorBoundary>
        ) : (
          <GuideFallback copy="Guide loads after the workspace is ready." />
        )}
      </div>

      <div className="rounded-[18px] border border-white/10 bg-black/30 p-3">
        <p className="text-sm leading-6 text-slate-200">{copy.message}</p>
        <div className="mt-3 grid gap-1.5 font-mono text-[0.68rem] text-cyan-100/70">
          {copy.terminal.map((line, index) => (
            <motion.span
              animate={motionEnabled ? { opacity: [0.36, 1, 0.36] } : { opacity: 0.72 }}
              key={line}
              transition={{ delay: index * 0.22, duration: 2.4, repeat: Infinity }}
            >
              &gt; {line}
            </motion.span>
          ))}
        </div>
      </div>

      <ContextPreview activeView={activeView} motionEnabled={motionEnabled} />

      <div className="mt-auto grid gap-2">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-300/35"
          onClick={playAudio}
          type="button"
        >
          <Volume2 className="h-4 w-4" />
          Hear Felipe explain this
        </button>
        <button
          className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-cyan-100"
          onClick={cta.action}
          type="button"
        >
          {cta.label}
        </button>
        <a
          className="sr-only"
          href={bookingHref}
          rel={bookingTarget ? "noopener noreferrer" : undefined}
          target={bookingTarget}
        >
          Calendar fallback
        </a>
      </div>
    </div>
  );
}

export default function GuidePanel({
  activeView,
  bookingHref,
  bookingTarget,
  hidden,
  motionEnabled,
  onHiddenChange,
  onViewChange,
}: {
  activeView: FelipeOSView;
  bookingHref: string;
  bookingTarget?: "_blank";
  hidden: boolean;
  motionEnabled: boolean;
  onHiddenChange: (hidden: boolean) => void;
  onViewChange: (view: FelipeOSView) => void;
}) {
  const isDesktop = useDesktopViewport();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loadModel, setLoadModel] = useState(false);
  const shouldLoadModel = !hidden && (isDesktop || mobileOpen);

  useEffect(() => {
    if (!shouldLoadModel || loadModel) return;
    const idle = window.requestIdleCallback ?? ((callback: IdleRequestCallback) => window.setTimeout(callback, 450));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => setLoadModel(true));
    return () => cancelIdle(handle as number);
  }, [loadModel, shouldLoadModel]);

  const bookingAction = useMemo(
    () => () => {
      window.open(bookingHref, bookingTarget || "_self", bookingTarget ? "noopener,noreferrer" : undefined);
    },
    [bookingHref, bookingTarget],
  );

  if (hidden) return null;

  return (
    <>
      <aside className="fixed bottom-24 right-5 top-14 z-30 hidden w-[330px] overflow-hidden rounded-[26px] border border-white/10 bg-[rgba(7,10,20,0.72)] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.44)] backdrop-blur-2xl lg:block">
        <GuideContent
          activeView={activeView}
          bookingHref={bookingHref}
          bookingTarget={bookingTarget}
          canLoadModel={loadModel && isDesktop}
          motionEnabled={motionEnabled}
          muted={muted}
          onHide={() => onHiddenChange(true)}
          onMutedChange={setMuted}
          onOpenBooking={bookingAction}
          onViewChange={onViewChange}
        />
      </aside>

      <div className="fixed bottom-24 right-3 z-50 lg:hidden">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-[#090914]/90 px-4 py-2 text-sm font-semibold text-cyan-50 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          onClick={() => setMobileOpen(true)}
          type="button"
        >
          Guide
          <ChevronDown className="h-4 w-4 rotate-180" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-black/55 px-3 pb-3 pt-[35vh] backdrop-blur-sm lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.section
              animate={{ y: 0 }}
              className="flex max-h-[65vh] min-h-[48vh] flex-col overflow-y-auto rounded-[26px] border border-white/10 bg-[#090914] p-4 shadow-[0_26px_90px_rgba(0,0,0,0.55)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              exit={{ y: 80 }}
              initial={{ y: 80 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="mb-3 flex justify-end">
                <button
                  aria-label="Close guide"
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-slate-200"
                  onClick={() => setMobileOpen(false)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <GuideContent
                activeView={activeView}
                bookingHref={bookingHref}
                bookingTarget={bookingTarget}
                canLoadModel={loadModel && mobileOpen}
                motionEnabled={motionEnabled}
                muted={muted}
                onHide={() => {
                  setMobileOpen(false);
                  onHiddenChange(true);
                }}
                onMutedChange={setMuted}
                onOpenBooking={bookingAction}
                onViewChange={(view) => {
                  setMobileOpen(false);
                  onViewChange(view);
                }}
              />
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
