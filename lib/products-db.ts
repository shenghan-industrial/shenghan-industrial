import { products as staticProductsRaw, migrateProduct } from "@/data/products";
import type { Product } from "@/data/products";
import { kvGetJSON, kvPutJSON, kvSeedIfEmpty } from "@/lib/kv-storage";

const KEY = "products";

const staticProducts = (staticProductsRaw as unknown[]).map((p) =>
  migrateProduct(p as Record<string, unknown>)
);

function normalizeProduct(p: Product): Product {
  const now = new Date().toISOString();
  return {
    ...p,
    sku: p.sku || `SY-${(p.category || "XX").slice(0, 2).toUpperCase()}-${p.id.slice(0, 8)}`,
    slug: p.slug || p.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    status: p.status || "published",
    gallery: p.gallery || p.images || [p.image],
    tags: p.tags || [],
    downloads: p.downloads || [],
    createdAt: p.createdAt || now,
    updatedAt: now,
  };
}

async function readAllProducts(): Promise<Product[]> {
  await kvSeedIfEmpty(KEY, staticProducts);
  const raw = (await kvGetJSON<Record<string, unknown>[]>(KEY)) ?? (staticProducts as unknown as Record<string, unknown>[]);
  const map = new Map<string, Product>();
  for (const item of raw) {
    const p = migrateProduct(item as unknown as Record<string, unknown>);
    map.set(p.id, normalizeProduct(p));
  }
  return [...map.values()];
}

export async function getAllProducts(): Promise<Product[]> {
  return readAllProducts();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readAllProducts();
  return products.find((p) => p.id === id);
}

export async function getProductsByCategory(cat: string): Promise<Product[]> {
  const products = await readAllProducts();
  return products.filter((p) => p.category === cat);
}

export async function searchProducts(q: string): Promise<Product[]> {
  const products = await readAllProducts();
  const lower = q.toLowerCase();
  return products.filter(
    (p) =>
      p.name.en.toLowerCase().includes(lower) ||
      p.name.zh.includes(q) ||
      p.subtitle.en.toLowerCase().includes(lower) ||
      (p.category && p.category.toLowerCase().includes(lower)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(lower)))
  );
}

export async function createProduct(product: Product): Promise<Product> {
  const products = await readAllProducts();
  const normalized = normalizeProduct(product);
  const idx = products.findIndex((p) => p.id === normalized.id);
  if (idx >= 0) products[idx] = normalized;
  else products.push(normalized);
  await kvPutJSON(KEY, products);
  return normalized;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await readAllProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = normalizeProduct({ ...products[idx], ...updates, id });
  products[idx] = updated;
  await kvPutJSON(KEY, products);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readAllProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  await kvPutJSON(KEY, products);
  return true;
}

export { staticProducts };
