const knownFor = [
  "Turning ambiguous product ideas into scoped MVPs, shipped workflows, and measurable next steps.",
  "Building observability into products so activation, engagement, retention, and revenue are visible early.",
  "Designing growth systems with measurable lift across experiments, pricing, onboarding, and funnels.",
  "Leading cross-functional execution with product, engineering, design, data, sales, and commercial teams.",
];

const workingStyle = [
  "Discovery → decide → ship → measure → iterate.",
  "Documentation and decision logs that reduce rework.",
  "Clear ownership and cadence to align stakeholders.",
];

export default function AboutSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`section section-surface ${compact ? "" : "scroll-mt-24"}`} id="about">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-5xl">
          <p className="eyebrow">About</p>
          <h2 className="section-title">Product & Growth Leader | 0→1 Builder for AI, SaaS, and Digital Growth</h2>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300">
            I bring 12+ years across telecom, e-commerce, and B2B SaaS, combining product discovery, growth experimentation, and analytics instrumentation. My work is strongest where the problem is messy: AI-enabled workflows, fragmented data, onboarding friction, unclear funnels, or products that need a sharper path from idea to adoption.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="glow-panel">
            <h3 className="text-2xl font-semibold text-white">What I’m Known For</h3>
            <ul className="mt-6 space-y-4">
              {knownFor.map((item) => (
                <li className="line-item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glow-panel glow-panel-cyan">
            <h3 className="text-2xl font-semibold text-white">How I Work</h3>
            <ul className="mt-6 space-y-4">
              {workingStyle.map((item) => (
                <li className="line-item line-item-cyan" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
