import FloatingSettings from "@/components/FloatingSettings";
import HomeJourney from "@/components/HomeJourney";
import PortraitSlot from "@/components/PortraitSlot";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Product & Growth Consultant",
  description:
    "Felipe Mejia helps SaaS, AI, telecom, and digital growth teams build agentic workflows, ship 0 to 1 products, instrument analytics, and create measurable growth systems.",
  keywords: [
    "AI product consultant",
    "agentic workflows",
    "AI workflow automation",
    "growth product consultant",
    "product analytics consultant",
    "0 to 1 product builder",
    "SaaS growth strategy",
    "Felipe Mejia",
  ],
};

export default function HomePage() {
  return (
    <>
      <PortraitSlot />
      <FloatingSettings />
      <HomeJourney />
    </>
  );
}
