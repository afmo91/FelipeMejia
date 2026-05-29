import SignalEntry from "@/components/SignalEntry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Felipe Mejia | Product, Growth & AI Systems",
  description:
    "Felipe Mejia builds AI-enabled products and growth systems. 12+ years from 0→1 across telecoms, SaaS and e-commerce. Product, growth and AI consulting.",
  keywords: [
    "AI product consultant",
    "growth product manager",
    "agentic workflows",
    "AI workflow automation",
    "product analytics consultant",
    "0 to 1 product builder",
    "SaaS growth strategy",
    "Felipe Mejia",
  ],
};

export default function HomePage() {
  return <SignalEntry />;
}
