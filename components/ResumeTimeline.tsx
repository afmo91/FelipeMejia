"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { CombinedCV } from "@/lib/cv";

function emphasizeMetrics(text: string) {
  const pattern = /(\+25%|-30%|€200K\+|€3M\+|~15%|5 days|same-day|12\+ years|0→1|6 channels)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) =>
    part.match(/^(\+25%|-30%|€200K\+|€3M\+|~15%|5 days|same-day|12\+ years|0→1|6 channels)$/) ? (
      <strong className="font-semibold text-white" key={`${part}-${index}`}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function ResumeTimeline({ cv }: { cv: CombinedCV }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[0.68fr_0.32fr]">
      <div className="relative">
        <div className="absolute bottom-0 left-4 top-2 hidden w-px bg-gradient-to-b from-accent via-accent2 to-transparent md:block" />
        <div className="space-y-5">
          {cv.experience.map((item, index) => {
            const open = openIndex === index;
            return (
              <motion.article
                className="relative md:pl-12"
                initial={{ opacity: 0, y: 24 }}
                key={item.company}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.4 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="absolute left-[11px] top-7 hidden h-3 w-3 bg-accent shadow-[0_0_24px_rgba(139,92,246,0.9)] md:block" />
                <button
                  aria-expanded={open}
                  className="glow-panel w-full text-left transition duration-300 hover:-translate-y-0.5 hover:border-accent2/50"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  type="button"
                >
                  <span className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <span>
                      <span className="block text-sm text-accent2">{item.company}</span>
                      <span className="mt-2 block text-2xl font-semibold text-white">{item.role}</span>
                    </span>
                    <span className="flex flex-wrap gap-2">
                      {item.metrics.slice(0, 3).map((metric) => (
                        <span className="metric-pill" key={metric}>
                          {metric}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      animate={{ height: "auto", opacity: 1 }}
                      className="overflow-hidden"
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                    >
                      <div className="px-1 pb-3 pt-5 md:px-7">
                        <ul className="space-y-3">
                          {item.bullets.map((bullet) => (
                            <li className="line-item leading-7" key={bullet}>
                              {emphasizeMetrics(bullet)}
                            </li>
                          ))}
                        </ul>
                        <Link className="mt-5 inline-block text-sm text-accent transition hover:text-white" href={item.caseStudyHref}>
                          Linked portfolio work
                        </Link>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>

      <aside className="glow-panel glow-panel-cyan h-fit">
        <h3 className="text-xl font-semibold text-white">Core Skills</h3>
        <div className="mt-6 space-y-6">
          {Object.entries(cv.skills).map(([group, skills]) => (
            <div key={group}>
              <p className="text-sm font-medium text-accent2">{group}</p>
              <p className="mt-2 leading-7 text-gray-300">{skills.join(", ")}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400">PDF downloads are protected.</p>
          <Link className="mt-3 inline-block text-sm text-accent transition hover:text-white" href="/cv">
            Sign in for tailored PDFs
          </Link>
        </div>
      </aside>
    </div>
  );
}
