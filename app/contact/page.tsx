import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Felipe Mejia for product, growth, AI workflow, analytics, and experimentation work.",
};

const links = [
  {
    href: "mailto:felipe@felipemejia.com",
    label: "felipe@felipemejia.com",
  },
  {
    href: "https://fr.linkedin.com/in/felipemejiaosorio",
    label: "LinkedIn",
  },
  {
    href: "https://github.com/felipemejia",
    label: "GitHub",
  },
];

export default function ContactPage() {
  return (
    <section className="section">
      <div className="max-w-4xl">
        <p className="text-sm font-medium text-accent2">Contact</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">Let’s build the next useful thing.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Reach out about product leadership, AI-enabled workflows, analytics instrumentation, growth systems, or 0→1 execution.
        </p>
      </div>

      <ContactForm />

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-8">
        {links.map((link) => (
          <a
            className="text-accent transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            href={link.href}
            key={link.href}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            target={link.href.startsWith("http") ? "_blank" : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
