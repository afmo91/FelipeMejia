"use client";

import { motion } from "framer-motion";

const services = [
  {
    metric: "0→1",
    proof: "From ambiguous opportunity to scoped MVP, roadmap, specs, and release rhythm.",
    title: "AI Product Strategy & MVP Definition",
  },
  {
    metric: "+25%",
    proof: "Experiment systems across landing pages, onboarding, pricing, lifecycle, and activation.",
    title: "Growth Experimentation Systems",
  },
  {
    metric: "€200K+",
    proof: "Attribution, dashboards, and decision loops that reveal waste and shift spend with confidence.",
    title: "Analytics, Attribution & Observability",
  },
  {
    metric: "5d → 1d",
    proof: "Digital onboarding redesigns that reduce friction and make activation measurable.",
    title: "Funnel & Onboarding Optimization",
  },
  {
    metric: "€3M+",
    proof: "Fractional product/growth leadership for teams that need cadence, prioritization, and delivery.",
    title: "Fractional Product & Growth Leadership",
  },
];

export default function ServicesSection() {
  return (
    <section className="section section-surface scroll-mt-24" id="services">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Services</p>
            <h2 className="section-title">Freelance product and growth support for teams that need traction.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              I help founders, SaaS teams, and growth leaders turn AI workflows, messy data, and funnel friction into focused product work with measurable outcomes.
            </p>
            <a className="button-primary mt-8 inline-flex" href="/contact">
              Work with me
            </a>
          </div>

          <div className="timeline-stack">
            {services.map((service, index) => (
              <motion.article
                className="timeline-row group"
                initial={{ opacity: 0, x: 28 }}
                key={service.title}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.45 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <span className="timeline-dot" />
                <div className="grid gap-5 md:grid-cols-[0.2fr_0.8fr]">
                  <p className="text-2xl font-semibold text-accent">{service.metric}</p>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">{service.title}</h3>
                    <p className="mt-3 leading-7 text-gray-300">{service.proof}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
