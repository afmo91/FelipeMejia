import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Felipe Mejia, a freelance product and growth leader for AI-enabled workflows, SaaS growth, analytics instrumentation, and 0 to 1 execution.",
};

export default function AboutPage() {
  return <AboutSection />;
}
