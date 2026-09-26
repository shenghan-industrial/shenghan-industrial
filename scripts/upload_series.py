#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Final pipeline: XIAOGUOLE (小国乐) series
   Excel metadata + corrected EN images -> Cloudinary -> site products.json
Resumable: image->URL cache kept in cloudinary_cache2.json.
Gentle rate: sequential uploads with exponential backoff (Cloudinary 429-safe).
"""
import os, re, json, time, hashlib, importlib.util, sys
import requests
import xlrd

ROOT = "/Users/yiyi/Desktop/新建文件夹_EN 5"
XLS = "/Users/yiyi/Desktop/副本小国乐(1).xls"
SITE = "/Users/yiyi/Desktop/shenghanindustrial-site"
TR = "/tmp/zipwork/translations.py"
CACHE = "/tmp/zipwork/cloudinary_cache2.json"

CLOUD_NAME = "wn0jxugx"
API_KEY = "651296621716161"
API_SECRET = "G79vVrr1eMeZLGKx96IjqotLphk"

spec = importlib.util.spec_from_file_location("tr", TR)
tr = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tr)
D, BRAND = tr.D, tr.BRAND

cache = {}
if os.path.exists(CACHE):
    cache = json.load(open(CACHE, encoding="utf-8"))


def model_of(s):
    m = re.search(r"\d{4}", s)
    return m.group(0) if m else None


# ── 1. read Excel ──────────────────────────────────────────────
def cellstr(v):
    if isinstance(v, float):
        return str(int(v)) if v == int(v) else str(v)
    return str(v).strip()


book = xlrd.open_workbook(XLS)
sh = book.sheet_by_index(0)
excel = {}
for r in range(2, sh.nrows):
    name = cellstr(sh.cell_value(r, 1)).strip()
    if not name:
        continue
    excel[model_of(name)] = {
        "zh": name,
        "barcode": cellstr(sh.cell_value(r, 2)).strip(),
        "spec": cellstr(sh.cell_value(r, 3)).strip(),
    }
print("excel products:", len(excel))


# ── 2. Cloudinary (gentle, resumable) ─────────────────────────
def cld_upload(path):
    ts = str(int(time.time()))
    sig = hashlib.sha1(f"folder=products&timestamp={ts}{API_SECRET}".encode()).hexdigest()
    with open(path, "rb") as f:
        return requests.post(
            f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload",
            files={"file": (os.path.basename(path), f, "image/jpeg")},
            data={"api_key": API_KEY, "timestamp": ts, "signature": sig, "folder": "products"},
            timeout=120,
        )


def ensure_upload(path):
    if path in cache:
        return cache[path], "cached"
    delay = 2
    for _ in range(7):
        try:
            r = cld_upload(path)
            if r.status_code == 200:
                u = r.json().get("secure_url")
                if u:
                    cache[path] = u
                    return u, "ok"
                return None, "no secure_url"
            if r.status_code in (429, 420, 500, 502, 503, 504):
                time.sleep(delay)
                delay = min(delay * 2, 60)
                continue
            return None, f"HTTP{r.status_code}:{r.text[:100]}"
        except Exception as e:
            time.sleep(delay)
            delay = min(delay * 2, 60)
    return None, "retries exhausted"


# ── 3. gather folders that actually have images ───────────────
folders = []
for d in sorted(os.listdir(ROOT)):
    fp = os.path.join(ROOT, d)
    if not os.path.isdir(fp):
        continue
    imgs = sorted(f for f in os.listdir(fp)
                  if f.lower().endswith(".jpg") and os.path.getsize(os.path.join(fp, f)) >= 2048)
    if imgs:
        folders.append((d, fp, imgs))
print("folders with images:", len(folders))

# ── 4. upload all images ──────────────────────────────────────
total = sum(len(i) for _, _, i in folders)
print("images to upload:", total, "| already cached:", sum(1 for _, _, i in folders for f in i if os.path.join(ROOT, "", f) in cache))
done = fails = 0
for d, fp, imgs in folders:
    for f in imgs:
        p = os.path.join(fp, f)
        url, st = ensure_upload(p)
        done += 1
        if not url:
            fails += 1
            print("  FAIL", f, st)
        if done % 15 == 0:
            json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            print(f"  progress {done}/{total} cached={len(cache)} fails={fails}", flush=True)
        time.sleep(0.35)
json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"upload phase done: {done} processed, {len(cache)} cached, {fails} failed")


# ── 5. build records ──────────────────────────────────────────
def en_packing(zh):
    if not zh:
        return ""
    s = (zh.replace("一件", "1 pc").replace("1件", "1 pc").replace("-件", "1 pc")
           .replace("中盒", "inner box").replace("中箱", "inner box")
           .replace("内箱", "inner box").replace("盒", "boxes")
           .replace("个", "pcs").replace("套", "sets").replace("把", "pcs")
           .replace("=", " = "))
    return " ".join(s.split())


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


records, noimg = [], []
for d, fp, imgs in folders:
    urls = [cache[os.path.join(fp, f)] for f in imgs if os.path.join(fp, f) in cache]
    if not urls:
        noimg.append(d)
        continue
    mm = model_of(d)
    ex = excel.get(mm, {})
    zh_name = ex.get("zh", d)
    barcode = ex.get("barcode", "")
    packing = ex.get("spec", "")
    en_name = D.get(d) or (tr.translate(d)[0] if tr.translate(d) else None) or d
    packing_en = en_packing(packing)
    pid = slugify(en_name)
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    brand = BRAND.get("小国乐", "XIAOGUOLE")
    records.append({
        "id": pid,
        "name": {"en": en_name, "zh": zh_name, "es": en_name},
        "subtitle": {"en": "Laundry & Cleaning Products — factory direct quality",
                     "zh": "洗化用品 — 工厂直供品质",
                     "es": "Detergentes y Limpieza — calidad directa de fábrica"},
        "category": "Laundry & Cleaning Products",
        "subCategory": "Laundry & Cleaning Products",
        "description": {
            "en": f"{en_name} — factory-direct cleaning tool from DEXOREN. "
                  + (packing_en + ". " if packing_en else "")
                  + "Minimum order 200 pcs, lead time 25–35 days. OEM/ODM customization, export packaging, worldwide delivery.",
            "zh": f"{zh_name} — DEXOREN工厂直供清洁用品。" + (packing + "。" if packing else "")
                  + "起订量200件，交期25–35天。支持OEM/ODM定制、出口包装及全球配送。",
            "es": f"{en_name} — herramienta de limpieza directa de fábrica de DEXOREN. "
                  + (packing_en + ". " if packing_en else "")
                  + "Pedido mínimo 200 pcs, plazo 25–35 días. Personalización OEM/ODM, embalaje de exportación.",
        },
        "features": {
            "en": ["Durable & ergonomic design", "Factory-direct pricing", "Export carton packaging", "OEM/ODM customization available"],
            "zh": ["耐用人体工学设计", "工厂直供价格", "出口纸箱包装", "支持OEM/ODM定制"],
            "es": ["Diseño duradero y ergonómico", "Precios directos de fábrica", "Embalaje de exportación", "Personalización OEM/ODM disponible"],
        },
        "specs": {
            "en": [{"label": "Barcode", "value": barcode or "N/A"},
                   {"label": "Packing", "value": packing_en or "Export carton"},
                   {"label": "MOQ", "value": "200 pcs"},
                   {"label": "Lead Time", "value": "25–35 days"},
                   {"label": "Customization", "value": "Available"}],
            "zh": [{"label": "条码", "value": barcode or "N/A"},
                   {"label": "装箱", "value": packing or "出口纸箱"},
                   {"label": "起订量", "value": "200 件"},
                   {"label": "交期", "value": "25–35 天"},
                   {"label": "定制", "value": "支持"}],
            "es": [{"label": "Código de barras", "value": barcode or "N/A"},
                   {"label": "Embalaje", "value": packing_en or "Caja de exportación"},
                   {"label": "Cantidad Mínima", "value": "200 pcs"},
                   {"label": "Plazo de Entrega", "value": "25–35 días"},
                   {"label": "Personalización", "value": "Disponible"}],
        },
        "image": urls[0],
        "images": urls,
        "gallery": urls,
        "price": "US$ 0.50–3.00 / pc",
        "brand": brand,
        "sku": barcode or f"SY-LCP-{pid[:8].upper()}",
        "model": mm or "",
        "slug": pid,
        "status": "published",
        "moq": "200 pcs",
        "minOrder": "200 pcs",
        "leadTime": "25–35 days",
        "tradeTerm": "EXW · FOB · CIF · DDP",
        "packaging": "Export carton",
        "certifications": ["ISO 9001", "REACH"],
        "tags": ["Laundry & Cleaning Products", "Cleaning Brush", brand],
        "partnerId": "shenghan-industrial",
        "createdAt": now,
        "updatedAt": now,
    })

print(f"\nrecords built: {len(records)} | folders skipped (no uploaded image): {len(noimg)}")
for x in noimg:
    print("  NOIMG", x)

# ── 6. clean old + merge ──────────────────────────────────────
new_ids = {r["id"] for r in records}
new_models = {r["model"] for r in records if r["model"]}
for target in [os.path.join(SITE, ".data/products.json"),
               os.path.join(SITE, "data/products.json")]:
    data = json.load(open(target, encoding="utf-8"))
    before = len(data)
    kept = [p for p in data
            if p.get("id") not in new_ids and str(p.get("model", "")) not in new_models]
    removed = before - len(kept)
    kept.extend(records)
    json.dump(kept, open(target, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"merged -> {os.path.basename(target)}: removed_old={removed} added={len(records)} total {before}->{len(kept)}")

print("\nsample records:")
for r in records[:5]:
    print(f"  {r['name']['zh'][:30]:32} | {r['name']['en'][:44]:46} | bc={r['sku']} | imgs={len(r['images'])}")
print("\nDONE")
