import ContactSection from "@/components/sections/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Felipe Mejia for product, growth, AI workflow, analytics, and experimentation work.",
};

export default function ContactPage() {
  return <ContactSection />;
}
