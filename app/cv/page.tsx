import Link from "next/link";
import type { Metadata } from "next";
import { getBaseCV } from "@/lib/cv";

export const metadata: Metadata = {
  title: "Felipe Mejia Public CV",
  description: "Public CV for Felipe Mejia, Product & Growth leader and AI systems builder.",
};

export default function PublicCVPage() {
  const cv = getBaseCV();

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Public CV</p>
            <h1 className="section-title">{cv.name}</h1>
            <p className="mt-4 text-2xl font-semibold text-accent2">{cv.title}</p>
            <div className="mt-7 space-y-4 text-lg leading-8 text-gray-300">
              {cv.summary.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="button-primary inline-flex" href="/cv/felipe-mejia-public-cv.pdf">
                Download CV
              </a>
              <Link className="button-secondary inline-flex" href="/#contact">
                Contact Felipe
              </Link>
            </div>
            <p className="mt-5 text-sm leading-6 text-gray-500">
              This public CV is the source of truth for visible professional data. Tailored versions are generated from this base and managed privately.
            </p>
          </div>

          <div className="glow-panel">
            <h2 className="text-2xl font-semibold text-white">Selected achievements</h2>
            <div className="mt-5 grid gap-3">
              {(cv.selectedAchievements || []).map((achievement) => (
                <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 leading-7 text-gray-300" key={achievement}>
                  {achievement}
                </p>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-16" aria-labelledby="public-cv-experience">
          <h2 className="text-3xl font-semibold text-white" id="public-cv-experience">
            Experience
          </h2>
          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {cv.experience.map((item) => (
              <article className="glow-panel" key={`${item.company}-${item.role}`}>
                <p className="text-sm font-medium text-accent2">{item.company}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{item.role}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.metrics.map((metric) => (
                    <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-gray-300" key={metric}>
                      {metric}
                    </span>
                  ))}
                </div>
                <ul className="mt-5 space-y-3">
                  {item.bullets.map((bullet) => (
                    <li className="line-item leading-7" key={bullet}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-label="CV skills tools and languages">
          <div className="glow-panel">
            <h2 className="text-2xl font-semibold text-white">Skills</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {Object.entries(cv.skills).map(([group, skills]) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4" key={group}>
                  <h3 className="font-semibold text-white">{group}</h3>
                  <p className="mt-2 leading-7 text-gray-300">{skills.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="glow-panel">
              <h2 className="text-2xl font-semibold text-white">Tools</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {(cv.tools || []).map((tool) => (
                  <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-sm text-gray-300" key={tool}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="glow-panel">
              <h2 className="text-2xl font-semibold text-white">Languages</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {(cv.languages || []).map((language) => (
                  <span className="rounded-full border border-accent2/20 bg-accent2/10 px-3 py-1.5 text-sm text-accent2" key={language}>
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
