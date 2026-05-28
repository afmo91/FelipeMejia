import ResumeSection from "@/components/sections/ResumeSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Interactive resume for Felipe Mejia, freelance product and growth leader covering AI workflows, SaaS growth, analytics, onboarding, and digital transformation.",
};

export default function ResumePage() {
  return <ResumeSection />;
}
