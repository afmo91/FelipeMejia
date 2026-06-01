import { getPosts } from "@/lib/content";
import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://felipemejia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/portfolio", "/resume", "/cv", "/blog", "/contact"].map((route) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date(),
    priority: route === "" ? 1 : 0.8,
    url: `${siteUrl}${route}`,
  }));

  const blogRoutes = getPosts().map((post) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date(post.date),
    priority: 0.7,
    url: `${siteUrl}/blog/${post.slug}`,
  }));

  return [...staticRoutes, ...blogRoutes];
}
