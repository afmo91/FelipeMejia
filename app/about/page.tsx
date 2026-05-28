import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Felipe Mejia, a product and growth leader known for shipping MVPs, building product observability, and leading cross-functional execution.",
};

const knownFor = [
  "Turning ambiguity into shipped MVPs (prioritization and ruthless scope management)",
  "Building observability into products (activation, engagement, retention)",
  "Designing growth systems with measurable lift (experiments, pricing, funnels)",
  "Leading cross-functional execution with product, engineering, design, data, sales",
];

const workingStyle = [
  "Discovery → decide → ship → measure → iterate",
  "Documentation and decision logs to reduce rework",
  "Clear ownership + cadence to align stakeholders",
];

export default function AboutPage() {
  return (
    <section className="section">
      <div className="max-w-5xl">
        <p className="text-sm font-medium text-accent2">About</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          Product & Growth Leader | 0→1 Builder
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300">
          I build products that ship, grow, and earn trust—combining product discovery, data instrumentation, and experimentation. I’m especially interested in AI-enabled workflows and analytics: turning messy real-world systems into usable software.
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl font-semibold text-white">What I’m known for</h2>
          <ul className="mt-6 space-y-4">
            {knownFor.map((item) => (
              <li className="border-l border-accent/70 pl-5 leading-7 text-gray-300" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">How I work</h2>
          <ul className="mt-6 space-y-4">
            {workingStyle.map((item) => (
              <li className="border-l border-accent2/70 pl-5 leading-7 text-gray-300" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-16 border-y border-white/10 py-10">
        <h2 className="text-2xl font-semibold text-white">Timeline</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          <li>
            <p className="text-sm text-accent">Spotz.pro</p>
            <p className="mt-2 leading-7 text-gray-300">Building an AI ads operating layer from zero.</p>
          </li>
          <li>
            <p className="text-sm text-accent">Adamo Telecom</p>
            <p className="mt-2 leading-7 text-gray-300">Transforming digital onboarding and growth systems across Spain.</p>
          </li>
          <li>
            <p className="text-sm text-accent">Earlier work</p>
            <p className="mt-2 leading-7 text-gray-300">Scaling growth, lifecycle, and analytics work across telecom, e-commerce, and B2B SaaS.</p>
          </li>
        </ol>
      </section>
    </section>
  );
}
