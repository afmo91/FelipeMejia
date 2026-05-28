import ResumeSection from "@/components/sections/ResumeSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Interactive resume for Felipe Mejia, covering product, growth, analytics, AI-enabled workflows, and digital transformation work.",
};

export default function ResumePage() {
  return <ResumeSection />;
}
