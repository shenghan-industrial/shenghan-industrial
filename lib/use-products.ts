"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/data/products";

let cache: Product[] | null = null;
let cacheTime = 0;
const TTL = 30000; // 30 seconds

export function useProducts(): { products: Product[]; loaded: boolean } {
  const [prods, setProds] = useState<Product[]>(cache || []);
  const [loaded, setLoaded] = useState(!!cache);

  useEffect(() => {
    if (cache && Date.now() - cacheTime < TTL) { setLoaded(true); return; }
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          cache = data; cacheTime = Date.now();
          setProds(data);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return { products: prods, loaded };
}
