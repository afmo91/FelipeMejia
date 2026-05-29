import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutShell from "@/components/LayoutShell";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getBaseCV } from "@/lib/cv";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://felipemejia.com";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Felipe Mejia | AI Product & Growth Consultant",
    template: "%s | Felipe Mejia",
  },
  description:
    "Felipe Mejia is an AI product and growth consultant helping SaaS, telecom, and digital teams build agentic workflows, ship 0 to 1 products, instrument analytics systems, and create measurable growth loops.",
  keywords: [
    "Felipe Mejia",
    "freelance product consultant",
    "growth product manager",
    "AI product strategy",
    "agentic AI workflows",
    "AI workflow automation",
    "SaaS growth",
    "product-led growth",
    "analytics instrumentation",
    "digital onboarding",
  ],
  openGraph: {
    description:
      "AI product and growth support for agentic workflows, experimentation, analytics, PLG, and digital onboarding.",
    siteName: "Felipe Mejia",
    title: "Felipe Mejia | AI Product & Growth Consultant",
    type: "website",
    url: siteUrl,
  },
  alternates: {
    canonical: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    description:
      "AI product and growth support for agentic workflows, experimentation, analytics, PLG, and digital onboarding.",
    title: "Felipe Mejia | AI Product & Growth Consultant",
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
          "Agentic AI workflow design",
          "AI Signal Lab diagnostics",
          "Growth experimentation",
          "Analytics instrumentation",
          "Digital onboarding optimization",
          "Fractional product leadership",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "AI product and growth consulting services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product clarity sprint" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Growth system audit" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI workflow build" } },
          ],
        },
      },
      {
        "@type": "SoftwareApplication",
        applicationCategory: "BusinessApplication",
        description:
          "A lightweight AI diagnostic on Felipe Mejia's portfolio that turns product, growth, and workflow challenges into a scoped signal brief.",
        name: "AI Signal Lab",
        operatingSystem: "Web",
        url: `${siteUrl}/#ai-signal-lab`,
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
        <LayoutShell header={<SiteHeader />} footer={<SiteFooter />}>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
