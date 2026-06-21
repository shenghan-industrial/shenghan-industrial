import { useState, useEffect } from "react";
import type { Category } from "@/data/categories";
import { categories as staticCategories } from "@/data/categories";

let cache: Category[] | null = null;
let cacheTime = 0;
const TTL = 15000; // 15 seconds

export function bustCategoriesCache() {
  cache = null;
  cacheTime = 0;
}

export function useCategories(): Category[] {
  const [cats, setCats] = useState<Category[]>(cache || staticCategories);

  useEffect(() => {
    if (cache && Date.now() - cacheTime < TTL) return;

    let cancelled = false;
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          cache = data; cacheTime = Date.now();
          setCats(data);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return cats;
}
