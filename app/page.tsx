import FelipeOSWorkspace from "@/components/felipe-os/FelipeOSWorkspace";
import { getBaseCV } from "@/lib/cv";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FelipeOS | Product, Growth & AI Systems",
  description:
    "FelipeOS is an AI-powered workspace for growth, product and automation. Felipe Mejia builds AI systems that turn messy operations into scalable growth engines.",
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
  return <FelipeOSWorkspace publicCV={getBaseCV()} />;
}
