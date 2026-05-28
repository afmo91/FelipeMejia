import type { Metadata } from "next";
import PortfolioSection from "@/components/sections/PortfolioSection";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected product and growth projects by Felipe Mejia, including AI ads, digital onboarding, attribution, experimentation, and product-led growth.",
};

export default function PortfolioPage() {
  return <PortfolioSection />;
}
