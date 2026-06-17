"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/data/categories";
import { categories as staticCategories } from "@/data/categories";

let cache: Category[] | null = null;
let cacheTime = 0;
const TTL = 60000; // 1 minute

export function useCategories(): Category[] {
  const [cats, setCats] = useState<Category[]>(cache || staticCategories);

  useEffect(() => {
    if (cache && Date.now() - cacheTime < TTL) return;
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          cache = data; cacheTime = Date.now();
          setCats(data);
        }
      })
      .catch(() => {});
  }, []);

  return cats;
}
