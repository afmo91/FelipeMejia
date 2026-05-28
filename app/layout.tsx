import "./globals.css";
import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getBaseCV } from "@/lib/cv";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://felipemejia.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Felipe Mejia | Product & Growth Leader",
    template: "%s | Felipe Mejia",
  },
  description:
    "Portfolio of Felipe Mejia, a product and growth leader building AI-enabled workflows, analytics systems, and 0 to 1 products.",
  openGraph: {
    description:
      "Product and growth portfolio covering AI-enabled workflows, experimentation, analytics, and digital onboarding work.",
    siteName: "Felipe Mejia",
    title: "Felipe Mejia | Product & Growth Leader",
    type: "website",
    url: siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { contact, name, title } = getBaseCV();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    email: contact.email,
    jobTitle: title,
    name,
    sameAs: [contact.linkedin.url, contact.github.url],
    url: siteUrl,
  };

  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <div className="min-h-screen bg-bg/80 text-fg">
          <SiteHeader />
          <main className="relative z-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
