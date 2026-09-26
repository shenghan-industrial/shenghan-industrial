#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rename the company brand: DEXOREN / DEXOREN  ->  DEXOREN

Kept untouched on purpose:
  - shenghanindustrial.com domain and sales@shenghanindustrial.com email
    (user confirmed the domain stays the same)
  - partnerId "shenghan-industrial" (internal data key, changing it would
    break product lookups)
"""
import os, re, json
from pathlib import Path

SITE = Path("/Users/yiyi/Desktop/shenghanindustrial-site")
EXTS = {".json", ".ts", ".tsx", ".md", ".py"}
SKIP_DIRS = {"node_modules", ".next", ".git", "out", "regen", "regen2", "broken_backup"}

# longest-first so composites are consumed before the bare brand token
REPLACEMENTS = [
    (r"DEXOREN\s+Industrial", "DEXOREN"),
    (r"DEXOREN", "DEXOREN"),
    (r"DEXOREN", "DEXOREN"),
    (r"DEXOREN", "DEXOREN"),
]

total_files = 0
total_hits = 0
per_file = []

for root, dirs, files in os.walk(SITE):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for f in sorted(files):
        fp = Path(root) / f
        if fp.suffix not in EXTS:
            continue
        if fp.name == "package-lock.json":
            continue
        try:
            src = fp.read_text(encoding="utf-8")
        except Exception:
            continue
        if not src:
            continue

        orig = src
        hits = 0
        for pat, rep in REPLACEMENTS:
            src, n = re.subn(pat, rep, src)
            hits += n

        if hits:
            fp.write_text(src, encoding="utf-8")
            total_files += 1
            total_hits += hits
            per_file.append((str(fp.relative_to(SITE)), hits))

print(f"files changed: {total_files}")
print(f"total replacements: {total_hits}")
print()
print("--- top 25 files by replacements ---")
for name, n in sorted(per_file, key=lambda x: -x[1])[:25]:
    print(f"  {n:6}  {name}")

# verify nothing brand-related is left
left = []
for root, dirs, files in os.walk(SITE):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for f in files:
        fp = Path(root) / f
        if fp.suffix not in EXTS or fp.name == "package-lock.json":
            continue
        try:
            s = fp.read_text(encoding="utf-8")
        except Exception:
            continue
        if re.search(r"DEXOREN|DEXOREN", s):
            left.append(str(fp.relative_to(SITE)))

print()
print("files still containing old brand:", len(left))
for x in left[:15]:
    print("   ", x)
