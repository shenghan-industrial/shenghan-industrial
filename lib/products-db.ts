import { products as staticProducts } from "@/data/products";
import type { Product } from "@/data/products";
import fs from "fs";
import path from "path";

const JSON_PATH = path.join(process.cwd(), "data", "products.json");

function readJson(): Product[] {
  try {
    if (fs.existsSync(JSON_PATH)) {
      return JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
    }
  } catch {}
  return staticProducts;
}

function writeJson(products: Product[]) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), "utf8");
}

export function getAllProducts(): Product[] {
  return readJson();
}

export function getProductById(id: string): Product | undefined {
  return readJson().find((p) => p.id === id);
}

export function getProductsByCategory(cat: string): Product[] {
  return readJson().filter((p) => p.category === cat);
}

export function searchProducts(q: string): Product[] {
  const lower = q.toLowerCase();
  return readJson().filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.subtitle.toLowerCase().includes(lower) ||
      (p.nameZh && p.nameZh.includes(q)) ||
      (p.category && p.category.toLowerCase().includes(lower))
  );
}

export function createProduct(product: Product): Product {
  const products = readJson();
  products.push(product);
  writeJson(products);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = readJson();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...updates, id };
  writeJson(products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = readJson();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  writeJson(products);
  return true;
}

export { staticProducts };
