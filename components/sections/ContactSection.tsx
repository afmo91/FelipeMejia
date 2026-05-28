import ContactForm from "@/components/ContactForm";
import { getBaseCV } from "@/lib/cv";

export default function ContactSection() {
  const { contact } = getBaseCV();

  const links = [
    {
      href: `mailto:${contact.email}`,
      label: contact.email,
    },
    {
      href: contact.linkedin.url,
      label: contact.linkedin.label,
    },
    {
      href: contact.github.url,
      label: contact.github.label,
    },
  ];

  return (
    <section className="section scroll-mt-24" id="contact">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="eyebrow">Contact</p>
          <h2 className="section-title">Let’s Build the Next Useful Thing</h2>
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
      </div>
    </section>
  );
}
