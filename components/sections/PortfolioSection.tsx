"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const projects = [
  {
    description:
      "Built a unified dashboard to orchestrate, observe, and optimize cross-channel campaigns.",
    impact: "Defined vision and roadmap, instrumented activation and retention, and tested freemium plus usage pricing.",
    metrics: ["AI ads platform", "6 channels", "PLG pricing"],
    slug: "spotz-ai-ads-operating-layer",
    stack: "AI workflows, multi-channel APIs, analytics, PLG pricing",
    title: "Spotz.pro — AI Ads Operating Layer",
  },
  {
    description:
      "Migrated a legacy flow to digital-first onboarding and aligned engineering, data, and commercial teams across Spain.",
    impact: "Reduced activation time from 5 days to same-day and improved retention through onboarding redesign.",
    metrics: ["5 days -> same-day", "Spain rollout", "Retention lift"],
    slug: "adamo-digital-onboarding",
    stack: "Salesforce, lifecycle analytics, onboarding, stakeholder cadence",
    title: "Adamo Telecom — Digital Onboarding Transformation",
  },
  {
    description: "Introduced attribution modeling to reallocate budget away from wasted spend.",
    impact: "Recovered €200K+ and turned dashboards into weekly C-level decision inputs.",
    metrics: ["€200K+ recovered", "C-level dashboards", "Budget governance"],
    slug: "attribution-spend-reallocation",
    stack: "Attribution modeling, dashboards, budget governance",
    title: "Attribution + Spend Reallocation",
  },
  {
    description: "Built an experimentation cadence across landing pages, checkout, creatives, and onboarding.",
    impact: "Improved conversion by 25% and reduced CAC by 30%.",
    metrics: ["+25% conversion", "-30% CAC", "Weekly cadence"],
    slug: "experimentation-engine",
    stack: "Experiment design, funnels, conversion optimization",
    title: "Experimentation Engine",
  },
  {
    description:
      "Embedded analytics into the product and used lifecycle metrics to guide roadmap decisions.",
    impact: "Moved from channel-by-channel marketing operations toward product-led growth loops.",
    metrics: ["Lifecycle metrics", "PLG motion", "Roadmap signal"],
    slug: "marketing-ops-to-plg",
    stack: "Product analytics, lifecycle metrics, roadmap prioritization",
    title: "From Marketing Ops to PLG",
  },
];

export default function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="section scroll-mt-24" id="portfolio">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <p className="eyebrow">Portfolio</p>
            <h2 className="section-title">Selected work with commercial outcomes.</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Five product and growth initiatives where the operating model mattered as much as the interface: clearer workflows, sharper instrumentation, and measurable lift.
            </p>
          </div>

          <div className="timeline-stack">
            {projects.map((project, index) => {
              const active = activeIndex === index;
              return (
                <motion.article
                  className={`timeline-row group ${active ? "border-accent2/60 pl-2" : ""}`}
                  id={`portfolio-${project.slug}`}
                  initial={{ opacity: 0, y: 34 }}
                  key={project.slug}
                  onMouseEnter={() => setActiveIndex(index)}
                  onViewportEnter={() => setActiveIndex(index)}
                  transition={{ duration: 0.46, delay: index * 0.04 }}
                  viewport={{ amount: 0.46 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <span className="timeline-dot" />
                  <div className="grid gap-5 md:grid-cols-[0.16fr_0.84fr]">
                    <p className="text-sm text-accent">{String(index + 1).padStart(2, "0")}</p>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">{project.title}</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.metrics.map((metric) => (
                          <span className="metric-pill" key={metric}>
                            {metric}
                          </span>
                        ))}
                      </div>
                      <p className="mt-5 max-w-3xl leading-7 text-gray-300">{project.description}</p>
                      <AnimatePresence initial={false}>
                        {active ? (
                          <motion.div
                            animate={{ height: "auto", opacity: 1 }}
                            className="overflow-hidden"
                            exit={{ height: 0, opacity: 0 }}
                            initial={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <p className="mt-3 max-w-3xl leading-7 text-gray-300">{project.impact}</p>
                            <p className="mt-5 text-sm text-accent2">{project.stack}</p>
                            <a
                              className="mt-5 inline-block text-sm text-accent transition hover:text-white"
                              href={`#portfolio-${project.slug}`}
                            >
                              View case study
                            </a>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
