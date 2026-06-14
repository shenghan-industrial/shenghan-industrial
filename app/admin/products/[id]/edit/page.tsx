"use client";

import { use, useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { ProductForm } from "@/app/admin/components/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(r => r.json())
      .then((data: Product[]) => { setProduct(data.find(p => p.id === id) || null); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="py-20 text-center"><p className="text-sm text-[#9B8E7E]">产品不存在</p></div>;

  return <ProductForm product={product} />;
}
