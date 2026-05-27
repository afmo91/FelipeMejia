import Link from "next/link";

const nav = ["/", "/about", "/portfolio", "/resume", "/blog", "/contact", "/login"];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-accent">FM</Link>
          <div className="flex flex-wrap gap-4">
            {nav.map((href) => (
              <Link key={href} href={href} className="nav-link">{href === "/" ? "Home" : href.slice(1)}</Link>
            ))}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/10 px-6 py-10 text-sm text-gray-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 md:flex-row">
          <p>© {new Date().getFullYear()} Felipe Mejia. All rights reserved.</p>
          <p><a href="https://linkedin.com" className="hover:text-accent">LinkedIn</a> · <a href="https://github.com" className="hover:text-accent">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
}
