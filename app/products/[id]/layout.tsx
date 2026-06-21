import { products as productsRaw } from "@/data/products";
import { migrateProduct } from "@/data/products";
import type { Metadata } from "next";

const BASE = "https://shenghanindustrial.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const raw = productsRaw.find((p) => p.id === id);
  if (!raw) {
    return { title: "Product Not Found" };
  }
  const product = migrateProduct(raw);
  const title = product.name.en;
  const description = product.description.en.slice(0, 160);
  const imageUrl = product.image.startsWith("/") ? `${BASE}${product.image}` : product.image;

  return {
    title,
    description,
    keywords: [product.name.en, product.name.zh, product.category, product.subCategory || "", "factory direct", "B2B", "wholesale", "manufacturer"],
    alternates: {
      canonical: `${BASE}/products/${product.id}`,
      languages: {
        en: `${BASE}/products/${product.id}`,
        zh: `${BASE}/products/${product.id}`,
        es: `${BASE}/products/${product.id}`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${BASE}/products/${product.id}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
      siteName: "Shengyu Industrial",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    other: {
      "product:price:amount": product.price || "",
      "product:price:currency": "USD",
      "product:category": product.category,
    },
  };
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
