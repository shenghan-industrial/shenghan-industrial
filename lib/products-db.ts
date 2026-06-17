import { products as staticProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { kvGetJSON, kvPutJSON, kvSeedIfEmpty } from "@/lib/kv-storage";

const KEY = "products";

export async function getAllProducts(): Promise<Product[]> {
  await kvSeedIfEmpty(KEY, staticProducts);
  const products = (await kvGetJSON<Product[]>(KEY)) ?? staticProducts;
  // Deduplicate by ID (keep LAST = most recent)
  const map = new Map<string, Product>();
  for (const p of products) map.set(p.id, p);
  return [...map.values()];
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.id === id);
}

export async function getProductsByCategory(cat: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.category === cat);
}

export async function searchProducts(q: string): Promise<Product[]> {
  const products = await getAllProducts();
  const lower = q.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.subtitle.toLowerCase().includes(lower) ||
      (p.nameZh && p.nameZh.includes(q)) ||
      (p.category && p.category.toLowerCase().includes(lower))
  );
}

export async function createProduct(product: Product): Promise<Product> {
  const products = await getAllProducts();
  // Replace existing product with same ID
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) products[idx] = product;
  else products.push(product);
  await kvPutJSON(KEY, products);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getAllProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates, id };
  await kvPutJSON(KEY, products);
  return products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getAllProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  await kvPutJSON(KEY, products);
  return true;
}

export { staticProducts };
