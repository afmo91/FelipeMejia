import FloatingSettings from "@/components/FloatingSettings";
import HomeJourney from "@/components/HomeJourney";
import PortraitSlot from "@/components/PortraitSlot";
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
      <HomeJourney />
    </>
  );
}
