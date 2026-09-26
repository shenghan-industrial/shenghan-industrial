#!/usr/bin/env python3
"""Remove the two liquid wash/care categories from the product database.

洗护液体类 = "Daily Care & Wash" + "Laundry & Cleaning Products"
These are hard to export (liquid hazmat) and carry the highest brand-IP risk.

Updates BOTH data/products.json and .data/products.json (parallel copies),
and writes a consistent result. Safe/restart-reseed friendly.
"""
import json, os, shutil, datetime

ROOT = "/Users/yiyi/Desktop/shenghanindustrial-site"
REMOVE = {"Daily Care & Wash", "Laundry & Cleaning Products"}
TS = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")

targets = [
    os.path.join(ROOT, "data/products.json"),
    os.path.join(ROOT, ".data/products.json"),
]

total_before = total_after = 0
removed_total = 0
for fp in targets:
    if not os.path.exists(fp):
        print(f"SKIP (missing): {fp}")
        continue
    bak = f"{fp}.bak_liquid_{TS}"
    shutil.copy(fp, bak)
    d = json.load(open(fp, encoding="utf-8"))
    before = len(d)
    kept = [p for p in d if p.get("category") not in REMOVE]
    after = len(kept)
    removed = before - after
    json.dump(kept, open(fp, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    total_before += before
    total_after += after
    removed_total += removed
    print(f"{fp}")
    print(f"  before={before}  after={after}  removed={removed}")
    print(f"  backup -> {bak}")

print()
print(f"TOTAL removed across files: {removed_total}")
print(f"Per-file after-count should match: data={total_after//(len(targets))} ")

# Verify no liquid-category products remain
for fp in targets:
    d = json.load(open(fp, encoding="utf-8"))
    residual = [p for p in d if p.get("category") in REMOVE]
    print(f"RESIDUAL in {os.path.basename(fp)}: {len(residual)}")
