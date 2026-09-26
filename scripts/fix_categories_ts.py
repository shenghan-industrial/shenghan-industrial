#!/usr/bin/env python3
"""Rewrite the `categories` array in data/categories.ts:
- Remove 2 liquid wash categories (Daily Care & Wash, Laundry & Cleaning Products)
- Remove 4 dead legacy entries with no products (Building Materials, Hardware, Appliances, Others)
- Keep the 9 七夕优品汇 mini-program non-liquid categories (in mini-program order)
- Keep Lighting + Furniture as supplementary categories
Also strip the two liquid keys from SUB_CATEGORY_CODES / CATEGORY_PREFIX maps.
"""
import re

FP = "/Users/yiyi/Desktop/shenghanindustrial-site/data/categories.ts"
s = open(FP, encoding="utf-8").read()

NEW_ARRAY = '''export const categories: Category[] = [
  // ── 七夕优品汇 mini-program categories (9 non-liquid, strict order) ──
  {
    id: "stationery-supplies",
    name: "Stationery Supplies",
    nameZh: "文具用品",
    nameEs: "Papelería",
    productCategory: "Stationery Supplies",
    children: [],
  },
  {
    id: "beauty-skincare",
    name: "Beauty & Skincare",
    nameZh: "美妆护肤",
    nameEs: "Belleza y Cuidado de la Piel",
    productCategory: "Beauty & Skincare",
    children: [],
  },
  {
    id: "fashion-accessories",
    name: "Fashion Accessories",
    nameZh: "时尚饰品",
    nameEs: "Accesorios de Moda",
    productCategory: "Fashion Accessories",
    children: [],
  },
  {
    id: "toys-entertainment",
    name: "Toys & Entertainment",
    nameZh: "玩具文娱",
    nameEs: "Juguetes y Entretenimiento",
    productCategory: "Toys & Entertainment",
    children: [],
  },
  {
    id: "hygiene-products",
    name: "Hygiene Products",
    nameZh: "卫生用品",
    nameEs: "Productos de Higiene",
    productCategory: "Hygiene Products",
    children: [],
  },
  {
    id: "hardware-supplies",
    name: "Hardware Supplies",
    nameZh: "五金用品",
    nameEs: "Ferretería",
    productCategory: "Hardware Supplies",
    children: [],
  },
  {
    id: "quality-appliances",
    name: "Home Appliances",
    nameZh: "品质家电",
    nameEs: "Electrodomésticos",
    productCategory: "Home Appliances",
    children: [],
  },
  {
    id: "sports-outdoor",
    name: "Sports & Outdoor",
    nameZh: "运动户外",
    nameEs: "Deportes y Exterior",
    productCategory: "Sports & Outdoor",
    children: [],
  },
  {
    id: "plastic-products",
    name: "Plastic Products",
    nameZh: "塑料制品",
    nameEs: "Productos de Plástico",
    productCategory: "Plastic Products",
    children: [],
  },
  // ── Supplementary categories (kept, NOT in mini-program) ──
  {
    id: "furniture",
    name: "Furniture",
    nameZh: "家具类",
    nameEs: "Muebles",
    productCategory: "Furniture",
    children: [
      { id: "sofas", name: "Sofas", nameZh: "沙发", nameEs: "Sofás", productSubCategory: "Sofas", productCategory: "Furniture" },
      { id: "beds", name: "Beds", nameZh: "床", nameEs: "Camas", productSubCategory: "Beds", productCategory: "Furniture" },
      { id: "mattresses", name: "Mattresses", nameZh: "床垫", nameEs: "Colchones", productSubCategory: "Mattresses", productCategory: "Furniture" },
    ],
  },
  {
    id: "lighting",
    name: "Lighting",
    nameZh: "灯具类",
    nameEs: "Iluminación",
    productCategory: "Lighting",
    groups: [
      {
        id: "indoor-lighting",
        name: "Indoor Lighting",
        nameZh: "室内灯具",
        nameEs: "Iluminación Interior",
        children: [],
      },
      {
        id: "outdoor-lighting",
        name: "Outdoor Lighting",
        nameZh: "室外灯具",
        nameEs: "Iluminación Exterior",
        children: [
          { id: "portable-emergency", name: "Mobile Emergency Charging Light", nameZh: "移动应急充电灯", nameEs: "Lámpara de emergencia portátil", productSubCategory: "Portable Emergency Rechargeable Light", productCategory: "Lighting" },
          { id: "industrial-mining", name: "Industrial Mining Lamp", nameZh: "工矿灯", nameEs: "Lámpara de Minería Industrial", productSubCategory: "Industrial Mining Lamp", productCategory: "Lighting" },
          { id: "floodlight", name: "Floodlight", nameZh: "投光灯", nameEs: "Lámpara de proyección", productSubCategory: "Floodlight", productCategory: "Lighting" },
          { id: "solar-flood", name: "Solar Floodlight", nameZh: "太阳能投光灯", nameEs: "Lámpara de luz solar", productSubCategory: "Solar Floodlight", productCategory: "Lighting" },
          { id: "solar-street", name: "Solar Street Light", nameZh: "太阳能路灯", nameEs: "Farol de luz solar", productSubCategory: "Solar Street Light", productCategory: "Lighting" },
        ],
      },
    ],
  },
];'''

# Replace the whole categories array block
pat = re.compile(r"export const categories: Category\[\] = \[.*?\n\];", re.S)
new_s, n = pat.subn(NEW_ARRAY, s, count=1)
assert n == 1, f"categories array not replaced (n={n})"

# Strip the two liquid keys from SUB_CATEGORY_CODES map
new_s = new_s.replace('  "Daily Care & Wash": "DCW",\n', "")
new_s = new_s.replace('  "Laundry & Cleaning Products": "LCP",\n', "")
# Strip from CATEGORY_PREFIX map: the line contains both liquid keys
new_s = new_s.replace(
    '  "Daily Care & Wash": "DC", "Laundry & Cleaning Products": "LC", "Stationery Supplies": "ST",\n',
    '  "Stationery Supplies": "ST",\n',
)

open(FP, "w", encoding="utf-8").write(new_s)
print("categories.ts rewritten. liquid keys stripped:", '"Daily Care & Wash": "DCW"' not in new_s and '"Daily Care & Wash": "DC"' not in new_s)
