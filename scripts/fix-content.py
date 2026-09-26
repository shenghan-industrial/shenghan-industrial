#!/usr/bin/env python3
"""
Clean English copy + generate SEO metadata for products.json.

Fixes:
  1. Strip Chinese from name.en / name.es (e.g. "Premium Sofas — DEXOREN揽辰沙发" -> "Premium Sofas")
  2. Replace placeholder names ("商品分类") with category-derived names
  3. De-duplicate identical names by appending model / id suffix (SEO: unique titles)
  4. Translate Chinese unit words in spec values ("1件=12瓶 有货" -> "1 case = 12 bottles (in stock)")
  5. Rewrite description.en/es/zh from a natural template (no mechanical "—" concatenation)
  6. Generate seoTitle / seoDescription / seoKeywords for en, zh, es

Idempotent: re-running produces the same result (already-clean values are left alone).
Usage: python3 scripts/fix-content.py [--dry-run]
"""
import json
import re
import shutil
import sys
from collections import Counter

HAN = re.compile(r"[\u4e00-\u9fff]")

# Chinese unit -> English (order matters: longest / most specific first)
UNIT_MAP = [
    ("中盒", "inner boxes"),
    ("件", "case"),
    ("个", "pcs"),
    ("盒", "boxes"),
    ("包", "packs"),
    ("支", "pcs"),
    ("对", "pairs"),
    ("套", "sets"),
    ("瓶", "bottles"),
    ("箱", "cartons"),
    ("块", "pcs"),
    ("打", "dozen"),
    ("卡", "cards"),
    ("把", "pcs"),
    ("只", "pcs"),
    ("袋", "bags"),
    ("条", "pcs"),
    ("板", "boards"),
    ("筒", "tubes"),
    ("本", "pcs"),
    ("根", "pcs"),
    ("提", "packs"),
]

PLACEHOLDERS = {"商品分类", "分类", "商品", "", "未命名"}

# suffixes this script may have added on a previous run (kept for idempotency)
GEN_SUFFIX = re.compile(r"\s+(?:#\d+|[A-Z]{2}-[A-Z]{2,4}-\d+)$")


def strip_gen_suffix(nm: str) -> str:
    return GEN_SUFFIX.sub("", nm).strip()


# singular form used when the preceding count is 1
SINGULAR = {
    "cases": "case", "boxes": "box", "bottles": "bottle", "cartons": "carton",
    "packs": "pack", "sets": "set", "cards": "card", "bags": "bag",
    "boards": "board", "tubes": "tube", "pairs": "pair", "inner boxes": "inner box",
}


def clean_spec_value(v: str) -> str:
    """'1件=4中盒=24支 有货' -> '1 case = 4 inner boxes = 24 pcs (in stock)'"""
    if not isinstance(v, str) or not HAN.search(v):
        return v
    s = v
    s = s.replace("有货", " (in stock)")
    for ch, en in UNIT_MAP:
        s = re.sub(r"(\d+)\s*" + ch, r"\1 " + en, s)
    # any leftover Chinese characters
    s = HAN.sub("", s)
    s = re.sub(r"\s*=\s*", " = ", s)
    # "1 pairs" -> "1 pair", "1 boxes" -> "1 box"
    for pl, sg in SINGULAR.items():
        s = re.sub(r"\b1\s+" + pl + r"\b", "1 " + sg, s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def base_name(name_en: str) -> str:
    """Strip Chinese segments from an English product name."""
    nm = (name_en or "").strip()
    if not nm:
        return ""
    if not HAN.search(nm):
        return nm
    parts = [x.strip() for x in re.split(r"[—–]", nm) if x.strip()]
    keep = [x for x in parts if not HAN.search(x)]
    return " — ".join(keep).strip()


def derive_name(p: dict) -> str:
    """Best-effort English name for a product."""
    nm = strip_gen_suffix(base_name((p.get("name") or {}).get("en", "")))
    if nm and nm not in PLACEHOLDERS:
        return nm
    # placeholder / empty -> derive from subCategory then category
    sub = (p.get("subCategory") or "").strip()
    cat = (p.get("category") or "").strip()
    return sub or cat or "General Merchandise"


def uniq_names(products: list) -> list:
    """Ensure every product has a globally unique English name.

    Ids are NOT a reliable disambiguator (many scraped ids end in "-2"),
    so a per-base-name counter is used and collisions are resolved
    against a `used` set.
    """
    names = [derive_name(p) for p in products]
    counts = Counter(names)
    seen = Counter()
    used: set[str] = set()
    out: list[str] = []
    for p, nm in zip(products, names):
        if counts[nm] == 1 and nm not in used:
            final = nm
        else:
            seen[nm] += 1
            model = (p.get("model") or "").strip()
            cand = f"{nm} {model}" if model else f"{nm} #{seen[nm]}"
            n = seen[nm]
            while cand in used:  # guarantee global uniqueness
                n += 1
                cand = f"{nm} #{n}"
            final = cand
        used.add(final)
        out.append(final)
    return out


CERT_ES = "Producción certificada"


def build_desc(p: dict, name: str, sub: str, lang: str) -> str:
    moq = p.get("moq") or "negotiable"
    lead = p.get("leadTime") or "25–35 days"
    certs = [c for c in (p.get("certifications") or []) if c]
    if lang == "en":
        cert_phrase = f"Certified to {', '.join(certs[:3])}. " if certs else ""
        return (
            f"{name} — factory-direct {sub.lower()} from DEXOREN. "
            f"{cert_phrase}Minimum order {moq}, standard lead time {lead}. "
            f"OEM/ODM customization, export-standard packaging and worldwide delivery."
        )
    if lang == "es":
        cert_phrase = f"Certificado según {', '.join(certs[:3])}. " if certs else ""
        return (
            f"{name} — {sub} directo de fábrica de DEXOREN. "
            f"{cert_phrase}Pedido mínimo {moq}, plazo de entrega {lead}. "
            f"Personalización OEM/ODM, embalaje de exportación y envío mundial."
        )
    # zh
    zh_name = (p.get("name") or {}).get("zh") or name
    cert_phrase = f"通过{', '.join(certs[:3])}认证。" if certs else ""
    return (
        f"{zh_name} — DEXOREN厂家直供{sub}。"
        f"{cert_phrase}起订量{moq}，交期{lead}。"
        f"支持OEM/ODM定制、出口标准包装及全球配送。"
    )


def trunc(s: str, n: int) -> str:
    s = s.strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def build_seo(p: dict, name: str, cat: str, sub: str):
    # Title: keep under ~60 chars
    title = f"{name} | Factory Direct {cat}"
    if len(title) > 60:
        title = f"{name} | DEXOREN"
    if len(title) > 60:
        title = trunc(name, 57) + " | SY"

    desc = build_desc(p, name, sub, "en")
    seo_desc = trunc(desc, 155)

    sub_l = sub.lower()
    cat_l = cat.lower()
    kws = [
        name,
        f"wholesale {sub_l}",
        f"{cat_l} supplier",
        f"China {cat_l} manufacturer",
        f"bulk {sub_l}",
        f"OEM {sub_l}",
        "factory direct",
        "DEXOREN",
    ]
    # dedupe preserving order
    seen = set()
    uniq = []
    for k in kws:
        if k and k.lower() not in seen:
            seen.add(k.lower())
            uniq.append(k)
    return title, seo_desc, ", ".join(uniq[:10])


def process(path: str, dry: bool = False):
    print(f"\n=== {path} ===")
    with open(path, encoding="utf-8") as f:
        products = json.load(f)
    n0 = len(products)

    names = uniq_names(products)

    changed_name = changed_spec = changed_desc = changed_seo = 0
    for p, name in zip(products, names):
        ml = p.get("name") or {}
        cat = (p.get("category") or "").strip() or "General Merchandise"
        sub = (p.get("subCategory") or "").strip() or cat

        # 1/2/3. name (en + es keep English-clean; zh untouched)
        old_en = ml.get("en", "")
        if old_en != name:
            changed_name += 1
        ml["en"] = name
        ml["es"] = name  # es was duplicating the Chinese-laden English
        p["name"] = ml

        # 4. spec values
        for lg in ("en", "es"):
            specs = (p.get("specs") or {}).get(lg)
            if isinstance(specs, list):
                for s in specs:
                    if isinstance(s, dict) and isinstance(s.get("value"), str):
                        nv = clean_spec_value(s["value"])
                        if nv != s["value"]:
                            changed_spec += 1
                            s["value"] = nv

        # 5. description
        for lg in ("en", "es", "zh"):
            nd = build_desc(p, name, sub, lg)
            desc = p.get("description") or {}
            if desc.get(lg) != nd:
                changed_desc += 1
            desc[lg] = nd
            p["description"] = desc

        # 6. SEO
        t_en, d_en, k_en = build_seo(p, name, cat, sub)
        seo_t = p.get("seoTitle") or {}
        seo_d = p.get("seoDescription") or {}
        seo_k = p.get("seoKeywords") or {}
        if not seo_t.get("en"):
            changed_seo += 1
        seo_t["en"] = t_en
        seo_t["zh"] = f"{name} | 厂家直供{cat}"
        seo_t["es"] = f"{name} | {cat} directo de fábrica"
        seo_d["en"] = d_en
        seo_d["zh"] = trunc(build_desc(p, name, sub, "zh"), 155)
        seo_d["es"] = trunc(build_desc(p, name, sub, "es"), 155)
        seo_k["en"] = k_en
        seo_k["zh"] = f"{name},批发{sub},{cat}供应商,厂家直供,贴牌定制"
        seo_k["es"] = f"{name}, {sub} al por mayor, proveedor de {cat}, fábrica directa"
        p["seoTitle"] = seo_t
        p["seoDescription"] = seo_d
        p["seoKeywords"] = seo_k

    print(f"  products            : {n0}")
    print(f"  names cleaned/fixed : {changed_name}")
    print(f"  spec values cleaned : {changed_spec}")
    print(f"  descriptions updated: {changed_desc}")
    print(f"  seo fields filled   : {changed_seo}")

    if not dry:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print("  -> written")
    return products


if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    targets = ["data/products.json", ".data/products.json"]
    for t in targets:
        try:
            if not dry:
                shutil.copy(t, t + ".bak")
            process(t, dry)
        except FileNotFoundError:
            print(f"skip (not found): {t}")
    print("\nDone." + (" (dry run, nothing written)" if dry else ""))
