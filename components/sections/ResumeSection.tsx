import Link from "next/link";
import { getBaseCV, combineCV } from "@/lib/cv";
import ResumeTimeline from "@/components/ResumeTimeline";

export default function ResumeSection() {
  const cv = combineCV(getBaseCV());

  return (
    <section className="section section-surface scroll-mt-24" id="resume">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="eyebrow">Resume</p>
          <h2 className="section-title">Interactive Career Timeline</h2>
          <div className="mt-6 space-y-3 text-lg leading-8 text-gray-300">
            {cv.summary.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link className="button-primary" href="/cv">
              Protected CV Downloads
            </Link>
            <a className="button-secondary" href={`mailto:${cv.contact.email}`}>
              {cv.contact.email}
            </a>
          </div>
        </div>

        <ResumeTimeline cv={cv} />
      </div>
    </section>
  );
}
