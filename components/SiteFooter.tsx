import Link from "next/link";

const socialLinks = [
  {
    href: "https://fr.linkedin.com/in/felipemejiaosorio",
    label: "LinkedIn profile for Felipe Mejia",
    text: "LinkedIn",
  },
  {
    href: "https://github.com/felipemejia",
    label: "GitHub profile for Felipe Mejia",
    text: "GitHub",
  },
  {
    href: "mailto:felipe@felipemejia.com",
    label: "Email Felipe Mejia",
    text: "Email",
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-sm text-gray-400 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <p>&copy; {new Date().getFullYear()} Felipe Mejia. All rights reserved.</p>
        <nav aria-label="Footer links" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="footer-link" href="/contact">
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
