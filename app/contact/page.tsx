import ContactSection from "@/components/sections/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Felipe Mejia for freelance product strategy, growth experimentation, AI workflow, analytics, onboarding, and PLG support.",
};

export default function ContactPage() {
  return <ContactSection />;
}
