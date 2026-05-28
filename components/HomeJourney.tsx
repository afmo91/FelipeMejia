"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import ContactForm from "@/components/ContactForm";

type JourneySide = "left" | "right";

type JourneyItem = {
  bullets: ReactNode[];
  cta?: ReactNode;
  dashboard: string;
  date: string;
  eyebrow: string;
  id: string;
  metrics: string[];
  side: JourneySide;
  title: ReactNode;
};

const items: JourneyItem[] = [
  {
    bullets: [
      <>Turn <span className="text-accent2">messy workflows</span> into usable AI-enabled products.</>,
      <>Build <span className="text-accent">instrumentation</span> before teams start guessing.</>,
      <>Create growth loops that connect <span className="text-pink-300">activation, retention, and revenue</span>.</>,
    ],
    cta: (
      <div className="mt-8 flex flex-wrap gap-4">
        <a className="button-primary" href="#contact">
          Work with me
        </a>
        <a className="button-secondary" href="#portfolio">
          View proof
        </a>
      </div>
    ),
    dashboard: "OPEN FOR SELECT FREELANCE WORK",
    date: "2026",
    eyebrow: "Freelance Product & Growth Leader | AI, SaaS, 0->1",
    id: "home",
    metrics: ["12+ years", "0->1 products", "AI workflows"],
    side: "left",
    title: <>I build AI-enabled products and growth systems that get traction.</>,
  },
  {
    bullets: [
      <>Define the <span className="text-accent2">smallest useful MVP</span>, roadmap, specs, and release rhythm.</>,
      <>Install an <span className="text-accent">experiment cadence</span> across acquisition, onboarding, lifecycle, and pricing.</>,
      <>Translate analytics into decisions: <span className="text-pink-300">what to ship, fix, pause, or scale</span>.</>,
    ],
    cta: (
      <a className="button-secondary mt-8 inline-flex" href="#contact">
        Start a project
      </a>
    ),
    dashboard: "FRACTIONAL / PROJECT-BASED",
    date: "NOW",
    eyebrow: "Services",
    id: "services",
    metrics: ["AI strategy", "Growth systems", "Dashboards"],
    side: "right",
    title: <>Freelance support for teams that need traction, not more decks.</>,
  },
  {
    bullets: [
      <>I work across <span className="text-accent2">telecom, e-commerce, and B2B SaaS</span>.</>,
      <>My edge is pairing <span className="text-accent">product discovery</span> with measurable growth execution.</>,
      <>I keep teams aligned through <span className="text-pink-300">clear ownership, decision logs, and cadence</span>.</>,
    ],
    dashboard: "OPERATOR PROFILE",
    date: "12+ YRS",
    eyebrow: "About",
    id: "about",
    metrics: ["Discovery", "Execution", "Observability"],
    side: "left",
    title: <>I turn ambiguous systems into shipped outcomes teams can measure.</>,
  },
  {
    bullets: [
      <>Spotz.pro: AI-powered advertising workflow platform across <span className="text-accent2">Google, Meta, LinkedIn, TikTok, X, and Pinterest</span>.</>,
      <>Adamo Telecom: onboarding transformation from <span className="text-accent">5 days to same-day activation</span>.</>,
      <>Growth system: <span className="text-pink-300">+25% conversion, -30% CAC, €200K+ recovered</span>.</>,
    ],
    cta: (
      <Link className="button-secondary mt-8 inline-flex" href="/cv">
        Protected CV downloads
      </Link>
    ),
    dashboard: "CAREER PROOF",
    date: "2013-2026",
    eyebrow: "Resume",
    id: "resume",
    metrics: ["+25% CVR", "-30% CAC", "€3M+ budget"],
    side: "right",
    title: <>Career timeline built around shipped outcomes.</>,
  },
  {
    bullets: [
      <>Spotz.pro: <span className="text-accent2">AI ads operating layer</span> for cross-channel workflows and analytics.</>,
      <>Adamo: <span className="text-accent">digital onboarding</span>, lifecycle visibility, and stakeholder alignment across Spain.</>,
      <>Attribution + experimentation became <span className="text-pink-300">weekly C-level decision inputs</span>.</>,
    ],
    cta: (
      <a className="button-secondary mt-8 inline-flex" href="#portfolio-spotz-ai-ads-operating-layer">
        View case studies
      </a>
    ),
    dashboard: "SELECTED WORK",
    date: "5 CASES",
    eyebrow: "Portfolio",
    id: "portfolio",
    metrics: ["6 channels", "same-day activation", "PLG"],
    side: "left",
    title: <>Selected work with commercial outcomes.</>,
  },
  {
    bullets: [
      <>Useful for founders and teams with a <span className="text-accent2">product, funnel, or AI workflow</span> that needs clarity.</>,
      <>I can help scope the work, instrument the system, and create an <span className="text-accent">execution rhythm</span>.</>,
      <>Best fit: teams that want <span className="text-pink-300">practical product leadership</span>, not vague advice.</>,
    ],
    cta: (
      <div className="mt-8">
        <ContactForm />
      </div>
    ),
    dashboard: "INTRO / PROJECT NOTE",
    date: "CONTACT",
    eyebrow: "Contact",
    id: "contact",
    metrics: ["Email", "LinkedIn", "GitHub"],
    side: "right",
    title: <>Have a product or growth system that needs focus?</>,
  },
];

function linePosition(side: JourneySide) {
  return side === "right" ? "39%" : "61%";
}

export default function HomeJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] || items[0];

  const shellStyle = useMemo(
    () =>
      ({
        "--journey-line-x": linePosition(activeItem.side),
      }) as CSSProperties,
    [activeItem.side],
  );

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
              side: item.side,
              titleX,
              titleY,
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
    <div className="journey-shell" style={shellStyle}>
      {items.map((item, index) => {
        const active = activeIndex === index;
        const TitleTag = index === 0 ? "h1" : "h2";
        const content = (
          <motion.div
            animate={{ opacity: active ? 1 : 0.72, scale: active ? 1 : 0.96, y: active ? 0 : 16 }}
            className={`journey-content ${active ? "journey-content-active" : ""}`}
            data-active={active ? "true" : "false"}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="dashboard-strip">
              <span>{item.date}</span>
              <span>{item.dashboard}</span>
            </div>
            <p className="eyebrow mt-6">{item.eyebrow}</p>
            <TitleTag
              className={`${
                index === 0 ? "text-4xl sm:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl" : "text-4xl lg:text-5xl 2xl:text-6xl"
              } mt-5 max-w-4xl font-display font-semibold leading-tight text-white`}
              data-portrait-title
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
            {item.id === "home" ? item.cta : null}
            <ul className="mt-8 grid gap-4 text-lg leading-8 text-gray-300">
              {item.bullets.map((bullet, bulletIndex) => (
                <li className="signal-line" key={bulletIndex}>
                  {bullet}
                </li>
              ))}
            </ul>
            {item.id === "home" ? null : item.cta}
          </motion.div>
        );

        return (
          <motion.section
            className={`journey-stage ${item.side === "right" ? "journey-stage-right" : "journey-stage-left"}`}
            data-journey-id={item.id}
            id={item.id === "home" ? undefined : item.id}
            initial={{ opacity: 0.5 }}
            key={item.id}
            onViewportEnter={() => setActiveIndex(index)}
            transition={{ duration: 0.5 }}
            viewport={{ amount: 0.48 }}
            whileInView={{ opacity: 1 }}
          >
            <span className={`journey-marker ${active ? "journey-marker-active" : ""}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </span>
            <div className="journey-left">{item.side === "left" ? content : null}</div>
            <div className="journey-right">{item.side === "right" ? content : null}</div>
          </motion.section>
        );
      })}
    </div>
  );
}
