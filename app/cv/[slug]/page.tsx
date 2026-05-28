import { notFound } from "next/navigation";
import { getCV, getCVSlugs } from "@/lib/content";
import { getCombinedCV, getCVTweaks } from "@/lib/cv";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    ...getCVSlugs().map((slug) => ({ slug })),
    ...getCVTweaks().map((tweak) => ({ slug: tweak.slug })),
  ];
}

type CVParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: CVParams }): Promise<Metadata> {
  const { slug } = await params;
  const combined = getCombinedCV(slug);
  if (combined) {
    return {
      title: combined.title,
      description: combined.summary.join(" "),
    };
  }

  const cv = getCV(slug);

  return {
    title: cv?.title || "Tailored CV",
    description: cv?.summary || "Tailored CV for Felipe Mejia.",
  };
}

export default async function CVPage({ params }: { params: CVParams }) {
  const { slug } = await params;
  const combined = getCombinedCV(slug);
  if (combined) {
    return (
      <section className="section">
        <div className="max-w-4xl">
          <p className="eyebrow">Tailored CV</p>
          <h1 className="section-title">{combined.title}</h1>
          <div className="mt-7 space-y-3 text-lg leading-8 text-gray-300">
            {combined.summary.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <a className="button-primary mt-8 inline-block" href={`/cv/${combined.slug}.pdf`}>
            Download PDF
          </a>
        </div>

        <section className="mt-14" aria-labelledby="cv-experience">
          <h2 className="text-2xl font-semibold text-white" id="cv-experience">
            Experience
          </h2>
          <div className="mt-6 space-y-9">
            {combined.experience.map((item) => (
              <article className="border-t border-white/10 pt-7" key={`${item.role}-${item.company}`}>
                <h3 className="text-xl font-semibold text-white">
                  {item.role} | {item.company}
                </h3>
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
      </section>
    );
  }

  const cv = getCV(slug);

  if (!cv) {
    return notFound();
  }

  return (
    <section className="section">
      <div className="max-w-4xl">
        <p className="text-sm font-medium text-accent2">Tailored CV</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">{cv.title}</h1>
        <p className="mt-7 text-lg leading-8 text-gray-300">{cv.summary}</p>
      </div>

      <section className="mt-14" aria-labelledby="cv-experience">
        <h2 className="text-2xl font-semibold text-white" id="cv-experience">
          Experience
        </h2>
        <div className="mt-6 space-y-9">
          {cv.experience.map((item) => (
            <article className="border-t border-white/10 pt-7" key={`${item.role}-${item.company}`}>
              <h3 className="text-xl font-semibold text-white">
                {item.role} | {item.company}
              </h3>
              <ul className="mt-5 space-y-3">
                {item.bullets.map((bullet) => (
                  <li className="border-l border-accent/70 pl-5 leading-7 text-gray-300" key={bullet}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-10 border-y border-white/10 py-10 md:grid-cols-2" aria-label="CV skills and tools">
        <div>
          <h2 className="text-2xl font-semibold text-white">Skills</h2>
          <ul className="mt-5 space-y-3">
            {cv.skills.map((skill) => (
              <li className="leading-7 text-gray-300" key={skill}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">Tools</h2>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            {cv.tools.map((tool) => (
              <li className="text-accent2" key={tool}>
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}
