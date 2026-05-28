"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#resume", label: "Resume" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
  { href: "/login", label: "Login" },
];

function isActiveLink(pathname: string, hash: string, href: string) {
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }

  if (href === "/") {
    return pathname === "/" && !hash;
  }

  return pathname.startsWith(href);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const renderLink = ({ href, label }: (typeof navItems)[number]) => {
    const active = isActiveLink(pathname, hash, href);
    return (
      <Link
        aria-current={active ? "page" : undefined}
        className={`nav-link ${active ? "nav-link-active" : ""}`}
        href={href}
        key={href}
        onClick={() => setOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/75 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10"
      >
        <Link
          aria-label="Felipe Mejia home"
          className="text-xl font-semibold text-white transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/"
          onClick={() => setOpen(false)}
        >
          FM
        </Link>

        <div className="hidden items-center gap-6 md:flex">{navItems.map(renderLink)}</div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-white transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:hidden"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          <span className="flex w-4 flex-col gap-1.5" aria-hidden="true">
            <span className={`h-px bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`h-px bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-px bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      <div
        className={`${open ? "block" : "hidden"} border-t border-white/10 bg-black/95 md:hidden`}
        id="mobile-navigation"
      >
        <nav aria-label="Mobile navigation" className="mx-auto grid max-w-7xl gap-1 px-6 py-5">
          {navItems.map(renderLink)}
        </nav>
      </div>
    </header>
  );
}
