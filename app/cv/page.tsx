import Link from "next/link";
import type { Metadata } from "next";
import { getBaseCV, getCombinedCVs } from "@/lib/cv";

export const metadata: Metadata = {
  title: "Protected CV Downloads",
  description: "Login-only tailored CV PDF downloads for Felipe Mejia.",
};

export default function ProtectedCVDownloadsPage() {
  const base = getBaseCV();
  const variants = getCombinedCVs();

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="eyebrow">Protected</p>
          <h1 className="section-title">CV Downloads</h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            The public CV is the canonical base. Application variants below are generated from the base CV plus focused tweaks, then stored as static PDFs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <article className="glow-panel">
            <p className="text-sm text-accent2">Base</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Public CV</h2>
            <p className="mt-4 leading-7 text-gray-300">{base.summary[0]}</p>
            <p className="mt-5 text-sm text-gray-400">No direct PDF download.</p>
          </article>

          {variants.map((variant) => (
            <article className="glow-panel" key={variant.slug}>
              <p className="text-sm text-accent2">{variant.application}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{variant.title}</h2>
              <p className="mt-4 leading-7 text-gray-300">{variant.summary[variant.summary.length - 1]}</p>
              <a className="mt-6 inline-block text-accent transition hover:text-white" href={`/cv/${variant.slug}.pdf`}>
                Download PDF
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <Link className="text-sm text-accent transition hover:text-white" href="/">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
