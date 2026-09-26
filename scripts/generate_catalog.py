#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate a B2B product catalogue PDF for DEXOREN.

Structure
  1. Cover
  2. About / Why us
  3. Category overview
  4. Product showcase by category (illustrated)
  5. Trade terms summary
  6. Contact
  7. Appendix: full product index (all SKUs, grouped by category)

Run:  python3 scripts/generate_catalog.py
Out:  ~/Desktop/DEXOREN-Product-Catalog.pdf
"""
import os, json, hashlib, io, re, time
from pathlib import Path
import requests
from PIL import Image as PILImage

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image as RLImage, KeepTogether,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── paths ──────────────────────────────────────────────────────
SITE = Path("/Users/yiyi/Desktop/shenghanindustrial-site")
OUT = Path("/Users/yiyi/Desktop/DEXOREN-Product-Catalog.pdf")
TMP = Path("/tmp/catalog_imgs")
TMP.mkdir(exist_ok=True)

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/STHeiti Light.ttc",
]
FONT = next((f for f in FONT_CANDIDATES if os.path.exists(f)), None)
if not FONT:
    raise SystemExit("No CJK font found")
pdfmetrics.registerFont(TTFont("CJK", FONT))
F = "CJK"

# ── brand colours ──────────────────────────────────────────────
DARK = colors.HexColor("#3D3730")
ACCENT = colors.HexColor("#B8A080")
LIGHT = colors.HexColor("#F5F2EF")
GREY = colors.HexColor("#9B8E7E")

PAGE_W, PAGE_H = A4
MARGIN = 14 * mm


# ── helpers ────────────────────────────────────────────────────
def s(name, size=9, leading=None, color=DARK, align=TA_LEFT, bold=False):
    return ParagraphStyle(
        name, fontName=F, fontSize=size, leading=leading or size * 1.35,
        textColor=color, alignment=align,
    )


STY_TITLE = s("t", 30, color=colors.white, align=TA_CENTER)
STY_SUB = s("sb", 11, color=colors.HexColor("#D9CDBB"), align=TA_CENTER)
STY_H1 = s("h1", 17, color=DARK)
STY_H2 = s("h2", 12, color=ACCENT)
STY_BODY = s("b", 9.5, color=DARK)
STY_SMALL = s("sm", 7.5, color=GREY)
STY_CELL = s("c", 7.6, color=DARK)
STY_CELL_ZH = s("cz", 7.2, color=GREY)
STY_IDX = s("idx", 6.8, color=DARK)
STY_IDX_ZH = s("idxz", 6.4, color=GREY)


def all_images(p):
    out = []
    for k in ("image", "images", "gallery"):
        v = p.get(k)
        if isinstance(v, str):
            out.append(v)
        elif isinstance(v, list):
            out.extend([x for x in v if isinstance(x, str)])
    return [x for x in out if x.strip()]


def local_file(u):
    if u.startswith("http"):
        return None
    fp = SITE / "public" / u.lstrip("/")
    return fp if fp.exists() else None


def fetch_image(p):
    """Return a local path to a usable product image, or None."""
    for u in all_images(p):
        if u.startswith("http"):
            cached = TMP / (hashlib.md5(u.encode()).hexdigest() + ".jpg")
            if not cached.exists():
                try:
                    r = requests.get(u, timeout=40)
                    if r.status_code == 200:
                        cached.write_bytes(r.content)
                except Exception:
                    continue
            if cached.exists():
                return cached
        else:
            fp = local_file(u)
            if fp:
                return fp
    return None


_img_cache = {}


def thumb(path, max_w=520):
    """Resize to a small JPEG, cached, returns bytes path."""
    key = (str(path), max_w)
    if key in _img_cache:
        return _img_cache[key]
    try:
        im = PILImage.open(path)
        im = im.convert("RGB")
        w, h = im.size
        if w > max_w:
            im = im.resize((max_w, int(h * max_w / w)), PILImage.LANCZOS)
        out = TMP / (hashlib.md5((str(path) + str(max_w)).encode()).hexdigest() + "_t.jpg")
        if not out.exists():
            im.save(out, "JPEG", quality=78, optimize=True)
        _img_cache[key] = out
        return out
    except Exception:
        return None


def pname(p, lang="en"):
    n = p.get("name")
    if isinstance(n, dict):
        return (n.get(lang) or n.get("en") or "").strip()
    return str(n or "").strip()


def barcode_of(p):
    sku = str(p.get("sku") or "")
    return sku if re.fullmatch(r"\d{8,14}", sku) else ""


def pack_of(p):
    try:
        for it in p.get("specs", {}).get("zh", []):
            if isinstance(it, dict) and it.get("label") in ("装箱", "包装"):
                return it.get("value", "")
    except Exception:
        pass
    return ""


# ── data ───────────────────────────────────────────────────────
products = json.load(open(SITE / "data/products.json", encoding="utf-8"))
print("products:", len(products))

cats = {}
for p in products:
    cats.setdefault(p.get("category", "Other"), []).append(p)
cat_names = sorted(cats, key=lambda c: -len(cats[c]))
print("categories:", len(cat_names))

SHOWCASE_PER_CAT = 12


def pick(cat_prods, n):
    """Prefer products with a real barcode, then those with images."""
    def score(p):
        return (0 if barcode_of(p) else 1, 0 if fetch_image(p) else 1)
    ordered = sorted(cat_prods, key=score)
    return ordered[:n]


# ── page furniture ─────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(DARK)
    canvas.rect(0, PAGE_H - 12 * mm, PAGE_W, 12 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont(F, 8)
    canvas.drawString(MARGIN, PAGE_H - 8 * mm, "SHENGYU INDUSTRIAL  ·  Home & General Merchandise")
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 8 * mm, "Product Catalogue 2026")
    canvas.setFillColor(GREY)
    canvas.setFont(F, 7.5)
    canvas.drawCentredString(PAGE_W / 2, 8 * mm, f"— {doc.page} —")
    canvas.drawString(MARGIN, 8 * mm, "sales@shenghanindustrial.com")
    canvas.drawRightString(PAGE_W - MARGIN, 8 * mm, "Linyi, Shandong, China")
    canvas.restoreState()


story = []
FW = PAGE_W - 2 * MARGIN

# ── 1. Cover ───────────────────────────────────────────────────
story.append(Spacer(1, 30 * mm))
cover = Table(
    [[Paragraph("SHENGYU<br/>INDUSTRIAL", STY_TITLE)],
     [Paragraph("Home &amp; General Merchandise Supply Chain", STY_SUB)],
     [Paragraph("8,000 m² Wholesale Showroom  ·  30,000+ SKUs  ·  Factory-Direct", STY_SUB)]],
    colWidths=[FW], rowHeights=[42 * mm, 10 * mm, 10 * mm],
)
cover.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), DARK),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 18),
]))
story.append(cover)
story.append(Spacer(1, 14 * mm))
story.append(Paragraph(
    "Product Catalogue", s("cv", 20, color=DARK, align=TA_CENTER)))
story.append(Spacer(1, 4 * mm))
story.append(Paragraph(
    f"{len(products):,} products across {len(cat_names)} categories", s("cv2", 11, color=GREY, align=TA_CENTER)))
story.append(Spacer(1, 20 * mm))
story.append(Paragraph(
    "Issued " + time.strftime("%B %Y"), s("cv3", 9, color=GREY, align=TA_CENTER)))
story.append(PageBreak())

# ── 2. About ───────────────────────────────────────────────────
story.append(Paragraph("About DEXOREN", STY_H1))
story.append(Spacer(1, 4 * mm))
about = [
    "DEXOREN is a one-stop home &amp; general merchandise supply chain partner based in Linyi, Shandong, China.",
    "We operate an 8,000 m² wholesale showroom backed by an integrated large-scale warehouse, supplying 30,000+ household SKUs across kitchen, cleaning, storage, textiles, décor, stationery, beauty, hardware, toys and more.",
    "We serve importers, wholesalers, retailers and project buyers across Southeast Asia, the Middle East, Africa and beyond, with factory-direct pricing, consolidated container loading and export-ready documentation.",
]
for a in about:
    story.append(Paragraph(a, STY_BODY))
    story.append(Spacer(1, 3 * mm))

story.append(Spacer(1, 5 * mm))
story.append(Paragraph("Why Buyers Choose Us", STY_H2))
story.append(Spacer(1, 3 * mm))
why = [
    ("8,000 m² showroom", "Inspect and compare thousands of live SKUs in one visit, or request a live video tour."),
    ("30,000+ SKUs", "One-stop consolidation — mix categories into a single container to cut per-unit landed cost."),
    ("Factory-direct pricing", "No trading margin. Transparent quotes in USD, valid 30 days."),
    ("Export-ready", "ISPM-15 fumigation, destination-market certification support and full shipping documents."),
    ("OEM &amp; private label", "Custom logo, colour, packaging and barcodes from 500–1,000 pcs per SKU."),
    ("Quality assurance", "Pre-shipment inspection by SGS / BV / Intertek welcome; AQL-based claims handled fast."),
]
rows = [[Paragraph(f"<b>{k}</b>", STY_CELL), Paragraph(v, STY_CELL)] for k, v in why]
t = Table(rows, colWidths=[45 * mm, FW - 45 * mm])
t.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BACKGROUND", (0, 0), (0, -1), LIGHT),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#E8E2DC")),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.append(t)
story.append(PageBreak())

# ── 3. Category overview ───────────────────────────────────────
story.append(Paragraph("Product Categories", STY_H1))
story.append(Spacer(1, 4 * mm))
rows = [[Paragraph("<b>Category</b>", STY_CELL), Paragraph("<b>SKUs</b>", STY_CELL)]]
for c in cat_names:
    rows.append([Paragraph(c, STY_CELL), Paragraph(f"{len(cats[c]):,}", STY_CELL)])
rows.append([Paragraph("<b>Total</b>", STY_CELL), Paragraph(f"<b>{len(products):,}</b>", STY_CELL)])
t = Table(rows, colWidths=[FW - 30 * mm, 30 * mm], repeatRows=1)
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), DARK),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#E8E2DC")),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (1, 0), (1, -1), "RIGHT"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -2), [colors.white, LIGHT]),
    ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#EFE9E2")),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.append(t)
story.append(PageBreak())

# ── 4. Showcase by category ────────────────────────────────────
CELL_W = FW / 2 - 3 * mm
IMG_W = CELL_W - 8 * mm


def card(p):
    path = fetch_image(p)
    img_cell = ""
    if path:
        tp = thumb(path, 520)
        if tp:
            try:
                iw, ih = PILImage.open(tp).size
                disp_w = IMG_W
                disp_h = disp_w * ih / iw
                if disp_h > 52 * mm:
                    disp_h = 52 * mm
                    disp_w = disp_h * iw / ih
                img_cell = RLImage(str(tp), width=disp_w, height=disp_h)
            except Exception:
                img_cell = ""
    bc = barcode_of(p)
    pk = pack_of(p)
    meta = " · ".join([x for x in [f"Barcode {bc}" if bc else "", pk] if x])
    body = [
        Paragraph(pname(p, "en") or "—", STY_CELL),
        Paragraph(pname(p, "zh"), STY_CELL_ZH),
    ]
    if meta:
        body.append(Paragraph(meta, s("m", 6.6, color=ACCENT)))
    inner = []
    if img_cell:
        inner.append([img_cell])
        inner.append([Spacer(1, 2 * mm)])
    inner.append(body)
    tb = Table(inner, colWidths=[CELL_W - 6 * mm])
    tb.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    cell = Table([[tb]], colWidths=[CELL_W])
    cell.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#E8E2DC")),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ]))
    return cell


for ci, c in enumerate(cat_names):
    picks = pick(cats[c], SHOWCASE_PER_CAT)
    story.append(Paragraph(c, STY_H1))
    story.append(Paragraph(
        f"{len(cats[c]):,} SKUs in this category  ·  showing {len(picks)} selected items", STY_SMALL))
    story.append(Spacer(1, 5 * mm))

    grid = []
    row = []
    for p in picks:
        row.append(card(p))
        if len(row) == 2:
            grid.append(row)
            row = []
    if row:
        row.append("")
        grid.append(row)
    t = Table(grid, colWidths=[CELL_W + 3 * mm, CELL_W + 3 * mm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 1.5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 1.5 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
    ]))
    story.append(t)
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(
        "Full item list for this category is in the appendix. More selections available on request.", STY_SMALL))
    story.append(PageBreak())
    print(f"  showcase: {c} -> {len(picks)}")

# ── 5. Trade terms ─────────────────────────────────────────────
story.append(Paragraph("Trade Terms at a Glance", STY_H1))
story.append(Spacer(1, 4 * mm))
terms = [
    ("Incoterms", "EXW · FOB · CIF · DAP · DDP — most orders ship FOB or CIF from Ningbo / Qingdao / Shanghai."),
    ("MOQ", "In-stock items from 10 pcs per SKU; OEM &amp; private label from 500–1,000 pcs per SKU."),
    ("Lead time", "Standard products 25–35 days; custom / OEM 35–45 days. Rush production on request."),
    ("Samples", "Available, shipped by DHL / FedEx / UPS with tracking. Sample cost refundable against your first bulk order."),
    ("Payment", "T/T bank transfer, L/C at sight, Trade Assurance / escrow, PayPal / Western Union for samples. Deposit and balance terms agreed per order."),
    ("Quotation", "Quoted in USD (CNY on request), valid 30 days."),
    ("Quality", "Pre-shipment inspection by SGS / BV / Intertek welcome. Defects beyond the agreed AQL are re-made or credited."),
    ("Claims", "Report shortage, damage or wrong shipment within 7 days of arrival with photo / video evidence."),
    ("Compliance", "Support for SASO, ESMA, PVOC, SONCAP, COC, plus FDA / LFGB / EU 1935/2004 for food-contact items."),
    ("Packaging", "Export cartons with cushioning; custom colour boxes, barcodes and palletization. Wooden pallets ISPM-15 fumigated on request."),
    ("Transit", "Sea: Bangkok / Laem Chabang 7–10 days; Jebel Ali (Dubai) 20–25 days; Mombasa / Lagos 30–40 days."),
    ("Warehouses", "Stock held in Southeast Asia (Bangkok · Kuala Lumpur) and Middle East (Dubai) hubs."),
]
rows = [[Paragraph("<b>Term</b>", STY_CELL), Paragraph("<b>Detail</b>", STY_CELL)]]
rows += [[Paragraph(k, STY_CELL), Paragraph(v, STY_CELL)] for k, v in terms]
t = Table(rows, colWidths=[40 * mm, FW - 40 * mm], repeatRows=1)
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), DARK),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#E8E2DC")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.append(t)
story.append(PageBreak())

# ── 6. Contact ─────────────────────────────────────────────────
story.append(Paragraph("Let's Talk", STY_H1))
story.append(Spacer(1, 4 * mm))
contact = [
    ("Company", "DEXOREN (DEXOREN)"),
    ("Email", "sales@shenghanindustrial.com"),
    ("Phone / WhatsApp", "+86 151 6391 6007"),
    ("Location", "Linyi, Shandong, China"),
    ("Showroom", "8,000 m² wholesale showroom · 30,000+ SKUs"),
    ("Warehouses", "SE Asia (Bangkok · Kuala Lumpur) · Middle East (Dubai)"),
    ("Markets served", "Southeast Asia · Middle East · Africa · and more"),
    ("Response time", "Usually within 12 hours (GMT+8)"),
]
rows = [[Paragraph(f"<b>{k}</b>", STY_CELL), Paragraph(v, STY_CELL)] for k, v in contact]
t = Table(rows, colWidths=[45 * mm, FW - 45 * mm])
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (0, -1), LIGHT),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#E8E2DC")),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(t)
story.append(Spacer(1, 8 * mm))
story.append(Paragraph(
    "Tell us your target market, products and quantities — we'll propose the best Incoterm, payment plan and shipping route.",
    STY_BODY))
story.append(PageBreak())

# ── 7. Appendix: full index ────────────────────────────────────
story.append(Paragraph("Appendix — Full Product Index", STY_H1))
story.append(Paragraph(
    f"All {len(products):,} products currently in our catalogue, grouped by category.", STY_SMALL))
story.append(Spacer(1, 4 * mm))

IDX_W = [FW - 62 * mm, 40 * mm, 22 * mm]
for c in cat_names:
    block = [Paragraph(f"{c}  ({len(cats[c]):,})", STY_H2), Spacer(1, 2 * mm)]
    rows = [[Paragraph("<b>Product</b>", STY_IDX), Paragraph("<b>中文品名</b>", STY_IDX),
             Paragraph("<b>Code</b>", STY_IDX)]]
    for p in cats[c]:
        rows.append([
            Paragraph(pname(p, "en") or "—", STY_IDX),
            Paragraph(pname(p, "zh") or "—", STY_IDX_ZH),
            Paragraph(barcode_of(p) or (str(p.get("model") or "")[:12]), STY_IDX),
        ])
    t = Table(rows, colWidths=IDX_W, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#E8E2DC")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    block.append(t)
    block.append(Spacer(1, 5 * mm))
    story.append(KeepTogether(block[:2]))
    story.append(t)
    story.append(Spacer(1, 5 * mm))
    print(f"  index: {c} -> {len(cats[c])}")

# ── build ──────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    str(OUT), pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=18 * mm, bottomMargin=14 * mm,
    title="DEXOREN — Product Catalogue",
    author="DEXOREN",
)
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print("\nDONE ->", OUT)
print("size: %.1f MB" % (OUT.stat().st_size / 1024 / 1024))
