import FloatingSettings from "@/components/FloatingSettings";
import PortraitSlot from "@/components/PortraitSlot";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ResumeSection from "@/components/sections/ResumeSection";
import ServicesSection from "@/components/sections/ServicesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freelance Product & Growth Consultant",
  description:
    "Felipe Mejia helps SaaS, AI, telecom, and digital growth teams ship 0 to 1 products, instrument analytics, and build measurable growth systems.",
};

export default function HomePage() {
  return (
    <>
      <PortraitSlot />
      <FloatingSettings />
      <section className="section relative z-10 grid min-h-[86vh] items-center gap-12 md:grid-cols-[1fr_0.72fr]">
        <div className="max-w-3xl py-16">
          <p className="text-sm font-medium text-accent2">Freelance Product & Growth Leader | AI, SaaS, 0-&gt;1</p>
          <h1 className="font-display mt-5 text-5xl font-semibold leading-tight text-white md:text-7xl">
            I build AI-enabled products and growth systems that get traction.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300">
            I help teams turn messy workflows, funnel friction, and scattered data into usable software, clear instrumentation, and measurable growth loops.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a className="button-primary" href="#contact">
              Work with me
            </a>
            <a className="button-secondary" href="#portfolio">
              View Work
            </a>
          </div>
        </div>
        <div className="hidden md:block" aria-hidden="true" />
      </section>
      <ServicesSection />
      <AboutSection />
      <ResumeSection />
      <PortfolioSection />
      <ContactSection />
    </>
  );
}
