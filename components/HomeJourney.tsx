"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AISignalLab from "@/components/AISignalLab";
import AskFelipe from "@/components/AskFelipe";
import ContactForm from "@/components/ContactForm";

type JourneySide = "left" | "right";
type JourneyItem = {
  kicker: string;
  id: string;
  label: string;
  metrics: string[];
  note: string;
  scan: string;
  side: JourneySide;
  title: ReactNode;
};

const items: JourneyItem[] = [
  {
    id: "what-i-do",
    kicker: "Product · Growth · AI Systems",
    label: "What I Do",
    metrics: ["12+ years", "0->1", "AI workflows", "Analytics"],
    note: "Start with the messy system, then find the first signal worth shipping around.",
    scan: "Signal lock",
    side: "left",
    title: <>I turn ambiguous workflows into AI-enabled products and measurable growth systems.</>,
  },
  {
    id: "how-i-help",
    kicker: "Focused engagement paths",
    label: "How I Help",
    metrics: ["Clarity sprint", "Growth audit", "AI workflow build"],
    note: "A good engagement creates shipped decisions, not a heavier backlog.",
    scan: "Route map",
    side: "right",
    title: <>Three ways to move from scattered effort to a focused operating system.</>,
  },
  {
    id: "ai-signal-lab",
    kicker: "Live agentic product demo",
    label: "AI Signal Lab",
    metrics: ["Diagnosis", "Missing signals", "First sprint", "AI layer"],
    note: "This is the work in miniature: describe the messy workflow and watch it become a scoped product brief.",
    scan: "Agent scan",
    side: "left",
    title: <>Try a lightweight AI diagnostic for a product, funnel, or workflow challenge.</>,
  },
  {
    id: "results",
    kicker: "Commercial proof",
    label: "Results",
    metrics: ["5 days -> same-day", "+25% conversion", "-30% CAC", "€200K+ recovered"],
    note: "The point of instrumentation is not prettier charts. It is faster decisions and visible lift.",
    scan: "Metric pulse",
    side: "right",
    title: <>The work is strongest when product decisions connect to business movement.</>,
  },
  {
    id: "experience",
    kicker: "Operator log",
    label: "Experience",
    metrics: ["Spotz.pro", "Adamo Telecom", "€3M+ budget", "C-level dashboards"],
    note: "Experience matters most when it shows how ambiguity became shipped outcomes.",
    scan: "Release history",
    side: "left",
    title: <>A product and growth track record built around execution, signal, and adoption.</>,
  },
  {
    id: "case-studies",
    kicker: "Problem -> Move -> Result",
    label: "Case Studies",
    metrics: ["AI ads", "Digital onboarding", "Attribution", "Experimentation"],
    note: "Every useful case study should answer the same question: what changed because of the work?",
    scan: "Proof map",
    side: "right",
    title: <>Selected work where the operating model mattered as much as the interface.</>,
  },
  {
    id: "contact",
    kicker: "Map the opportunity",
    label: "Start",
    metrics: ["Scope", "Signals", "Sprint", "Decision cadence"],
    note: "Bring the messy version. The first job is to make the opportunity legible.",
    scan: "Project brief",
    side: "left",
    title: <>Have a product, growth, or AI workflow that needs sharper execution?</>,
  },
];

const services = [
  {
    description: "Turn a fuzzy product idea into a prioritized MVP, user journey, metrics, and release path.",
    title: "Product clarity sprint",
  },
  {
    description: "Find funnel leaks, instrumentation gaps, pricing questions, and the experiment cadence to fix them.",
    title: "Growth system audit",
  },
  {
    description: "Design an AI-assisted workflow that classifies work, surfaces exceptions, and feeds decisions back into dashboards.",
    title: "AI workflow build",
  },
];

const results = [
  ["5 days -> same-day", "Activation time reduced through digital onboarding"],
  ["+25%", "Conversion lift from experimentation cadence"],
  ["-30%", "CAC reduction through sharper funnel execution"],
  ["€200K+", "Recovered by attribution and spend reallocation"],
  ["€3M+", "Annual performance budget owned across channels"],
];

const experience = [
  {
    company: "Spotz.pro",
    detail: "Built an AI-powered multi-channel advertising platform across Google, Meta, LinkedIn, TikTok, X, and Pinterest.",
    role: "Product Builder",
    year: "2025-2026",
  },
  {
    company: "Adamo Telecom",
    detail: "Digitized onboarding, unified customer data, built attribution, and turned dashboards into weekly C-level decision inputs.",
    role: "Growth Product Manager",
    year: "2019-2025",
  },
];

const cases = [
  ["AI Ads Operating Layer", "Fragmented campaign workflows", "Unified workflow + analytics dashboard", "Cross-channel observability"],
  ["Digital Onboarding", "Legacy activation delay", "Digital-first onboarding redesign", "5 days -> same-day"],
  ["Attribution Model", "Wasted performance spend", "Budget governance dashboards", "€200K+ recovered"],
  ["Experimentation Engine", "Slow funnel learning", "Weekly hypothesis cadence", "+25% conversion, -30% CAC"],
];

function SectionBody({ item }: { item: JourneyItem }) {
  if (item.id === "how-i-help") {
    return (
      <div className="route-grid">
        {services.map((service) => (
          <article className="scan-readout" key={service.title}>
            <span>Route</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    );
  }

  if (item.id === "ai-signal-lab") {
    return <AISignalLab sectionLabel={item.label} />;
  }

  if (item.id === "results") {
    return (
      <div className="metric-grid">
        {results.map(([value, label]) => (
          <div className="metric-tile" key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (item.id === "experience") {
    return (
      <div className="operator-log">
        {experience.map((entry) => (
          <article key={entry.company}>
            <span>{entry.year}</span>
            <h3>{entry.company}</h3>
            <p className="text-accent2">{entry.role}</p>
            <p>{entry.detail}</p>
          </article>
        ))}
        <Link className="button-secondary mt-6 inline-flex" href="/cv">
          Protected CV downloads
        </Link>
      </div>
    );
  }

  if (item.id === "case-studies") {
    return (
      <div className="case-map">
        {cases.map(([title, problem, move, result]) => (
          <article id={`portfolio-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`} key={title}>
            <h3>{title}</h3>
            <div>
              <span>Problem</span>
              <p>{problem}</p>
            </div>
            <div>
              <span>Move</span>
              <p>{move}</p>
            </div>
            <div>
              <span>Result</span>
              <p>{result}</p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (item.id === "contact") {
    return (
      <div className="start-grid">
        <div className="scan-readout">
          <span>Best fit</span>
          <h3>Focused product, growth, or AI workflow challenges</h3>
          <p>
            Send the context: what is stuck, what data you trust, what decision you need to make, and what success would
            look like in the next few weeks.
          </p>
        </div>
        <ContactForm />
      </div>
    );
  }

  return (
    <div className="signal-fragments">
      <span>Messy workflows</span>
      <span>Clear product bets</span>
      <span>Instrumented decisions</span>
      <span>Measurable traction</span>
    </div>
  );
}

export default function HomeJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] || items[0];
  void activeItem;

  useEffect(() => {
    let frame = 0;

    function publishFocus(index = activeIndex) {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        const item = items[index] || items[0];
        const title = document.querySelector<HTMLElement>(`[data-journey-id="${item.id}"] [data-portrait-title]`);
        const rect = title?.getBoundingClientRect();
        const titleX = rect ? (rect.left + rect.width * 0.5) / window.innerWidth : item.side === "right" ? 0.72 : 0.28;
        const titleY = rect ? (rect.top + rect.height * 0.42) / window.innerHeight : 0.42;

        window.dispatchEvent(
          new CustomEvent("portrait-focus-change", {
            detail: {
              id: item.id,
              index,
              progress: index / Math.max(items.length - 1, 1),
              scale: item.id === "what-i-do" ? 0.92 : item.id === "ai-signal-lab" ? 0.78 : item.id === "contact" ? 0.7 : 0.8,
              side: item.side,
              titleX,
              titleY,
            },
          }),
        );
        window.dispatchEvent(
          new CustomEvent("signal-section-change", {
            detail: {
              id: item.id,
              label: item.label,
              note: item.note,
            },
          }),
        );
        frame = 0;
      });
    }

    publishFocus();
    const updateFocus = () => publishFocus();
    window.addEventListener("resize", updateFocus, { passive: true });
    window.addEventListener("scroll", updateFocus, { passive: true });
    return () => {
      window.removeEventListener("resize", updateFocus);
      window.removeEventListener("scroll", updateFocus);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [activeIndex]);

  return (
    <>
      <div className="journey-shell signal-scan">
        {/* Mission control HUD */}
        <div className="journey-hud" aria-hidden>
          <span><span className="journey-hud-dot" />Live scan</span>
          <span>Phase {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <span className="journey-hud-live">Signal lock</span>
        </div>
        {/* Animated scan pulse on the dual-rail spine */}
        <div className="spine-pulse-track" aria-hidden><div className="spine-pulse" /></div>
        {items.map((item, index) => {
          const active = activeIndex === index;
          const TitleTag = index === 0 ? "h1" : "h2";
          const content = (
            <motion.div
              animate={{ opacity: active ? 1 : 0.7, scale: active ? 1 : 0.97, y: active ? 0 : 18 }}
              className={`journey-content ${active ? "journey-content-active" : ""}`}
              data-active={active ? "true" : "false"}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="scan-status">
                <span>{item.scan}</span>
                <span>{item.kicker}</span>
              </div>
              <p className="eyebrow mt-6">{item.label}</p>
              <TitleTag
                className={`${
                  index === 0 ? "text-4xl sm:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl" : "text-3xl lg:text-4xl 2xl:text-5xl"
                } mt-5 max-w-4xl font-display font-semibold leading-tight text-white`}
                data-portrait-title
                id={`${item.id}-title`}
              >
                {item.title}
              </TitleTag>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.metrics.map((metric) => (
                  <span className="metric-pill" key={metric}>
                    {metric}
                  </span>
                ))}
              </div>
              <SectionBody item={item} />
            </motion.div>
          );

          return (
            <motion.section
              aria-labelledby={`${item.id}-title`}
              className={`journey-stage ${item.side === "right" ? "journey-stage-right" : "journey-stage-left"}`}
              data-journey-id={item.id}
              id={item.id === "what-i-do" ? undefined : item.id}
              initial={{ opacity: 0.5 }}
              key={item.id}
              onViewportEnter={() => setActiveIndex(index)}
              transition={{ duration: 0.5 }}
              viewport={{ amount: 0.42 }}
              whileInView={{ opacity: 1 }}
            >
              <span className={`journey-marker ${active ? "journey-marker-active" : ""}`} aria-hidden>
                <span className="journey-marker-phase">{String(index + 1).padStart(2, "0")}</span>
                <span className="journey-marker-label">{item.label}</span>
              </span>
              <div className="journey-left">{item.side === "left" ? content : null}</div>
              <div className="journey-right">{item.side === "right" ? content : null}</div>
            </motion.section>
          );
        })}
      </div>
      <AskFelipe />
    </>
  );
}
