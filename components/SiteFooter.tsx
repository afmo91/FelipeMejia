import Link from "next/link";
import { getBaseCV } from "@/lib/cv";

export default function SiteFooter() {
  const { contact } = getBaseCV();
  const socialLinks = [
    {
      href: contact.linkedin.url,
      label: contact.linkedin.label,
      text: "LinkedIn",
    },
    {
      href: contact.github.url,
      label: contact.github.label,
      text: "GitHub",
    },
    {
      href: `mailto:${contact.email}`,
      label: `Email ${contact.email}`,
      text: contact.email,
    },
  ];

  return (
    <footer className="border-t border-white/10 px-6 py-10 text-sm text-gray-400 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <p>&copy; {new Date().getFullYear()} Felipe Mejia. All rights reserved.</p>
        <nav aria-label="Footer links" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="footer-link" href="/#contact">
            Contact
          </Link>
          {socialLinks.map((link) => (
            <a
              aria-label={link.label}
              className="footer-link"
              href={link.href}
              key={link.href}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              target={link.href.startsWith("http") ? "_blank" : undefined}
            >
              {link.text}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
