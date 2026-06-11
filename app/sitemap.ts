import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://shenghanindustrial.com";

  const pages = ["/", "/about", "/contact", "/privacy", "/terms"];

  return pages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
