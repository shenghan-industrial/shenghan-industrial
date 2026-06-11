import { products } from "@/data/products";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return { title: "Product Not Found | Shenghan Industrial" };
  }

  return {
    title: `${product.name} | Shenghan Industrial`,
    description: product.description,
    keywords: [product.name, product.category, product.subCategory || "", "factory direct", "China manufacturer", "wholesale", "B2B"],
  };
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
