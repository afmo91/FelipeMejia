import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Felipe Mejia, a product and growth leader known for shipping MVPs, building product observability, and leading cross-functional execution.",
};

export default function AboutPage() {
  return <AboutSection />;
}
