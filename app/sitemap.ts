import type { MetadataRoute } from "next";
import { products as productsRaw } from "@/data/products";
import { categories as staticCategories } from "@/data/categories";

const BASE = "https://shenghanindustrial.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ── Static pages ───────────────────────────────────────
  entries.push(
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/promotions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/new-arrivals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/flash-deals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  );

  // ── Dynamic: product detail pages ──────────────────────
  const productIds = new Set<string>();
  for (const p of productsRaw) {
    if (p.id && !productIds.has(p.id as string)) {
      productIds.add(p.id as string);
      entries.push({
        url: `${BASE}/products/${p.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // ── Dynamic: ranking pages per subcategory ─────────────
  for (const cat of staticCategories) {
    const subs = cat.children || cat.groups?.flatMap((g) => g.children) || [];
    for (const sub of subs) {
      if (sub.productCategory && sub.productSubCategory) {
        entries.push({
          url: `${BASE}/rankings/${sub.productCategory}/${sub.productSubCategory}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
