import { categories as staticCategories } from "@/data/categories";
import type { Category, SubCategory } from "@/data/categories";
import { kvGetJSON, kvPutJSON, kvSeedIfEmpty } from "@/lib/kv-storage";

const KEY = "categories";

export async function getAllCategories(): Promise<Category[]> {
  await kvSeedIfEmpty(KEY, staticCategories);
  return (await kvGetJSON<Category[]>(KEY)) ?? staticCategories;
}

export async function saveAllCategories(cats: Category[]): Promise<void> {
  await kvPutJSON(KEY, cats);
}

export async function createCategory(cat: Category): Promise<Category> {
  const cats = await getAllCategories();
  cats.push(cat);
  await kvPutJSON(KEY, cats);
  return cat;
}

export async function updateCategory(catId: string, updates: Partial<Category>): Promise<boolean> {
  const cats = await getAllCategories();
  const idx = cats.findIndex((c) => c.id === catId);
  if (idx === -1) return false;
  cats[idx] = { ...cats[idx], ...updates };
  await kvPutJSON(KEY, cats);
  return true;
}

export async function deleteCategory(catId: string): Promise<boolean> {
  const cats = await getAllCategories();
  const idx = cats.findIndex((c) => c.id === catId);
  if (idx === -1) return false;
  cats.splice(idx, 1);
  await kvPutJSON(KEY, cats);
  return true;
}

function findSubArray(cat: Category): SubCategory[] | null {
  if (cat.children) return cat.children;
  if (cat.groups) {
    for (const g of cat.groups) {
      if (g.children) return g.children;
    }
  }
  return null;
}

export async function addSubCategory(catId: string, sub: SubCategory): Promise<boolean> {
  const cats = await getAllCategories();
  const cat = cats.find((c) => c.id === catId);
  if (!cat) return false;

  const arr = findSubArray(cat);
  if (arr) {
    arr.push(sub);
  } else {
    cat.children = [sub];
  }
  await kvPutJSON(KEY, cats);
  return true;
}

export async function updateSubCategory(catId: string, subId: string, updates: Partial<SubCategory>): Promise<boolean> {
  const cats = await getAllCategories();
  const cat = cats.find((c) => c.id === catId);
  if (!cat) return false;

  const arr = findSubArray(cat);
  if (arr) {
    const idx = arr.findIndex((s) => s.id === subId);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...updates };
      await kvPutJSON(KEY, cats);
      return true;
    }
  }
  return false;
}

export async function deleteSubCategory(catId: string, subId: string): Promise<boolean> {
  const cats = await getAllCategories();
  const cat = cats.find((c) => c.id === catId);
  if (!cat) return false;

  const arr = findSubArray(cat);
  if (arr) {
    const idx = arr.findIndex((s) => s.id === subId);
    if (idx !== -1) {
      arr.splice(idx, 1);
      await kvPutJSON(KEY, cats);
      return true;
    }
  }
  return false;
}
