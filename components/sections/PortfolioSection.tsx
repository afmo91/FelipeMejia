const projects = [
  {
    description:
      "Built a unified dashboard to orchestrate, observe, and optimize cross-channel campaigns.",
    impact: "Defined vision/roadmap; instrumented activation and retention; tested freemium + usage pricing.",
    slug: "spotz-ai-ads-operating-layer",
    stack: "AI workflows, multi-channel APIs, analytics, PLG pricing",
    title: "Spotz.pro — AI Ads Operating Layer",
  },
  {
    description:
      "Migrated a legacy flow to digital-first onboarding and aligned engineering/data/commercial teams across Spain.",
    impact: "Reduced activation time from 5 days to same-day; improved retention via onboarding redesign.",
    slug: "adamo-digital-onboarding",
    stack: "Salesforce, lifecycle analytics, onboarding, stakeholder cadence",
    title: "Adamo Telecom — Digital Onboarding Transformation",
  },
  {
    description: "Introduced attribution modeling to reallocate budget away from wasted spend.",
    impact: "Recovered €200K+; dashboards became weekly C-level decision inputs.",
    slug: "attribution-spend-reallocation",
    stack: "Attribution modeling, dashboards, budget governance",
    title: "Attribution + Spend Reallocation",
  },
  {
    description: "Built an experimentation cadence across landing pages, checkout, creatives, and onboarding.",
    impact: "+25% conversion, -30% CAC.",
    slug: "experimentation-engine",
    stack: "Experiment design, funnels, conversion optimization",
    title: "Experimentation Engine",
  },
  {
    description:
      "Embedded analytics into the product and used lifecycle metrics to guide roadmap decisions.",
    impact: "Shipped fast with tight feedback loops across stakeholders.",
    slug: "marketing-ops-to-plg",
    stack: "Product analytics, lifecycle metrics, roadmap prioritization",
    title: "From Marketing Ops to PLG",
  },
];

export default function PortfolioSection() {
  return (
    <section className="section scroll-mt-24" id="portfolio">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="eyebrow">Portfolio</p>
          <h2 className="section-title">Selected Work</h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Five product and growth initiatives where the operating model mattered as much as the interface.
          </p>
        </div>

        <div className="mt-14">
          {projects.map((project, index) => (
            <article
              className="group relative border-t border-white/10 py-9 transition duration-300 hover:border-accent/70 hover:pl-2 hover:shadow-[0_0_54px_rgba(139,92,246,0.16)]"
              id={`portfolio-${project.slug}`}
              key={project.slug}
            >
              <div className="grid gap-6 lg:grid-cols-[0.18fr_0.82fr]">
                <p className="text-sm text-accent">{String(index + 1).padStart(2, "0")}</p>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-4 max-w-3xl leading-7 text-gray-300">{project.description}</p>
                  <p className="mt-3 max-w-3xl leading-7 text-gray-300">{project.impact}</p>
                  <p className="mt-5 text-sm text-accent2">{project.stack}</p>
                  <a className="mt-5 inline-block text-sm text-accent transition hover:text-white" href={`#portfolio-${project.slug}`}>
                    View case study
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
