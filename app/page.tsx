import AnimatedSection from "@/components/AnimatedSection";
import PortraitSlot from "@/components/PortraitSlot";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Product and growth portfolio for Felipe Mejia, focused on AI-enabled workflows, experimentation, analytics, and 0 to 1 product building.",
};

export default function HomePage() {
  return (
    <>
      <section className="section grid min-h-[78vh] items-center gap-12 md:grid-cols-[1fr_0.9fr]">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-accent2">Product & Growth Leader | 0-&gt;1 Builder</p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-white md:text-7xl">
            Building products that ship, grow, and earn trust.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300">
            I combine product discovery, data instrumentation, and experimentation to turn messy real-world systems into usable AI-enabled software.
          </p>
        </div>
        <PortraitSlot />
      </section>
      <AnimatedSection>
        <div className="max-w-4xl">
          <h2 className="text-3xl font-semibold text-white">Where I Focus</h2>
          <p className="mt-5 text-lg leading-8 text-gray-300">
            AI workflow products, analytics dashboards, pricing experiments, onboarding redesign, and product-led growth systems that give teams a clearer operating rhythm.
          </p>
        </div>
      </AnimatedSection>
      <AnimatedSection className="pt-0">
        <div className="grid gap-8 border-y border-white/10 py-12 md:grid-cols-3">
          {[
            ["0->1", "Define the smallest lovable scope, align the team, ship the first version, and measure what matters."],
            ["Growth", "Build experimentation loops across funnels, pricing, lifecycle, and activation."],
            ["Observability", "Turn dashboards and lifecycle metrics into product decisions, not vanity reporting."],
          ].map(([label, text]) => (
            <div key={label}>
              <p className="text-sm font-medium text-accent">{label}</p>
              <p className="mt-3 leading-7 text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
