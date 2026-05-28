import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getBaseCV } from "@/lib/cv";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://felipemejia.com";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Felipe Mejia | Freelance Product & Growth Consultant",
    template: "%s | Felipe Mejia",
  },
  description:
    "Felipe Mejia is a freelance product and growth consultant helping SaaS, AI, telecom, and digital teams ship 0 to 1 products, analytics systems, and measurable growth loops.",
  keywords: [
    "Felipe Mejia",
    "freelance product consultant",
    "growth product manager",
    "AI product strategy",
    "SaaS growth",
    "product-led growth",
    "analytics instrumentation",
    "digital onboarding",
  ],
  openGraph: {
    description:
      "Freelance product and growth support for AI-enabled workflows, experimentation, analytics, PLG, and digital onboarding.",
    siteName: "Felipe Mejia",
    title: "Felipe Mejia | Freelance Product & Growth Consultant",
    type: "website",
    url: siteUrl,
  },
  alternates: {
    canonical: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Freelance product and growth support for AI-enabled workflows, experimentation, analytics, PLG, and digital onboarding.",
    title: "Felipe Mejia | Freelance Product & Growth Consultant",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { contact, name, title } = getBaseCV();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        email: contact.email,
        jobTitle: title,
        name,
        sameAs: [contact.linkedin.url, contact.github.url],
        url: siteUrl,
      },
      {
        "@type": "ProfessionalService",
        email: contact.email,
        name: "Felipe Mejia Product & Growth Consulting",
        sameAs: [contact.linkedin.url, contact.github.url],
        url: siteUrl,
        areaServed: "Global",
        serviceType: [
          "AI product strategy",
          "Growth experimentation",
          "Analytics instrumentation",
          "Digital onboarding optimization",
          "Fractional product leadership",
        ],
      },
      {
        "@type": "WebSite",
        name: "Felipe Mejia",
        url: siteUrl,
      },
    ],
  };

  return (
    <html className={`${geist.variable} ${geistMono.variable}`} lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <div className="site-shell">
          <SiteHeader />
          <main className="relative z-10">{children}</main>
          <div className="relative z-10">
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
