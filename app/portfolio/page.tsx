import type { Metadata } from "next";
import PortfolioSection from "@/components/sections/PortfolioSection";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Commercial product and growth work by Felipe Mejia, including AI ads, digital onboarding, attribution, experimentation, SaaS analytics, and PLG systems.",
};

export default function PortfolioPage() {
  return <PortfolioSection />;
}
