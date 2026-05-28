import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume for Felipe Mejia, covering product, growth, analytics, AI-enabled workflows, and digital transformation work.",
};

const summary = [
  "12+ years driving product + growth outcomes across telecom, e-commerce, and B2B SaaS.",
  "0→1 builder with strong execution, cross-functional leadership, and data instrumentation.",
  "Experienced in AI-enabled workflows, analytics dashboards, pricing experiments, and PLG motions.",
];

const experience = [
  {
    bullets: [
      "Defined product vision and roadmap for an AI-powered platform spanning Google, Meta, LinkedIn, TikTok, X, and Pinterest.",
      "Built unified analytics + workflow dashboard; introduced observability for cross-channel performance.",
      "Designed and tested pricing (freemium + usage-based); instrumented lifecycle metrics.",
      "Led end-to-end delivery: specs, alignment, API integrations, QA, releases.",
    ],
    company: "Spotz.pro",
    link: "/portfolio#spotz-ai-ads-operating-layer",
    role: "Product Builder",
  },
  {
    bullets: [
      "Unified customer data across Salesforce + marketing stack for full-funnel visibility.",
      "Digitized onboarding and reduced activation time to same-day across Spain.",
      "Designed/redesigned onboarding flows; reduced churn by 15%.",
      "Built an experimentation program (+25% conversion, -30% CAC); recovered €200K+ via attribution; dashboards used weekly by C-level.",
      "Owned €3M+ annual budget across Google Ads, Meta Ads, and programmatic.",
    ],
    company: "Adamo Telecom",
    link: "/portfolio#adamo-digital-onboarding",
    role: "Growth Product Manager",
  },
];

const skills = [
  "Product: AI strategy, discovery, prioritization, analytics/observability, builder mindset",
  "Growth: experiments, funnels, onboarding, pricing tests, attribution, CAC/CLV",
  "Collaboration: stakeholder management, program cadence, cross-functional leadership",
];

const tools = [
  "Analytics: GA4, Mixpanel, Tableau",
  "PM: Jira, Asana, Trello",
  "CRM/GTM: Salesforce, HubSpot, Zoho",
  "Dev/Data: SQL, APIs",
];

export default function ResumePage() {
  return (
    <section className="section">
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-accent2">Resume</p>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">Felipe Mejia</h1>
        </div>
        <a className="button-primary w-fit" href="/resume/latest.pdf">
          Download PDF
        </a>
      </div>

      <section className="mt-12" aria-labelledby="resume-summary">
        <h2 className="text-2xl font-semibold text-white" id="resume-summary">
          Summary
        </h2>
        <ul className="mt-5 space-y-3">
          {summary.map((item) => (
            <li className="leading-7 text-gray-300" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="resume-experience">
        <h2 className="text-2xl font-semibold text-white" id="resume-experience">
          Experience
        </h2>
        <div className="mt-6 space-y-10">
          {experience.map((item) => (
            <article className="border-t border-white/10 pt-7" key={`${item.role}-${item.company}`}>
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-baseline">
                <h3 className="text-xl font-semibold text-white">
                  {item.role} | {item.company}
                </h3>
                <Link className="text-sm text-accent transition hover:text-white" href={item.link}>
                  Related portfolio entry
                </Link>
              </div>
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

      <section className="mt-14 grid gap-10 border-y border-white/10 py-10 md:grid-cols-2" aria-label="Skills and tools">
        <div>
          <h2 className="text-2xl font-semibold text-white">Skills</h2>
          <ul className="mt-5 space-y-3">
            {skills.map((skill) => (
              <li className="leading-7 text-gray-300" key={skill}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">Tools</h2>
          <ul className="mt-5 space-y-3">
            {tools.map((tool) => (
              <li className="leading-7 text-gray-300" key={tool}>
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">Education</h2>
          <p className="mt-5 leading-7 text-gray-300">IÉSEG School of Management</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">Languages</h2>
          <p className="mt-5 leading-7 text-gray-300">Spanish, English, French</p>
        </div>
      </section>
    </section>
  );
}
