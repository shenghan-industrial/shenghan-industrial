"""Generate placeholder SVG images for all image slots."""
from pathlib import Path

BASE = Path("D:/跨境001/public/images")

# Ensure directories exist
for d in ["factory", "products", "quality"]:
    (BASE / d).mkdir(parents=True, exist_ok=True)

def svg(w, h, label, sublabel=""):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#bg)"/>
  <rect x="{w//2-140}" y="{h//2-80}" width="280" height="160" rx="12" fill="#c9a96e" opacity="0.08"/>
  <circle cx="{w//2}" cy="{h//2-20}" r="50" fill="none" stroke="#c9a96e" stroke-width="1.5" opacity="0.35"/>
  <line x1="{w//2-30}" y1="{h//2-20}" x2="{w//2-10}" y2="{h//2-20}" stroke="#c9a96e" stroke-width="1.5" opacity="0.35"/>
  <line x1="{w//2+10}" y1="{h//2-20}" x2="{w//2+30}" y2="{h//2-20}" stroke="#c9a96e" stroke-width="1.5" opacity="0.35"/>
  <text x="{w//2}" y="{h//2+20}" text-anchor="middle" fill="#c9a96e" font-size="16" font-family="sans-serif" opacity="0.6">{label}</text>
  <text x="{w//2}" y="{h//2+48}" text-anchor="middle" fill="#8a8a9e" font-size="11" font-family="sans-serif" opacity="0.4">{sublabel or f'{w} x {h} placeholder'}</text>
</svg>"""

images = {
    # Root-level product & hero images
    "": [
        ("product-1", 800, 600, "SG-9000 Silicone Structural Sealant", "Product photo — 800 x 600"),
        ("product-2", 800, 600, "WS-7000 Weatherproof Sealant", "Product photo — 800 x 600"),
        ("product-3", 800, 600, "SA-5000 Epoxy Stone Adhesive", "Product photo — 800 x 600"),
        ("product-4", 800, 600, "IG-8000 Insulating Glass Sealant", "Product photo — 800 x 600"),
        ("factory-bg", 1600, 900, "Factory Overview", "Replace with your factory photo — 1600 x 900"),
    ],
    # Factory images
    "factory": [
        ("factory-line", 800, 600, "Automated Production Line", "Replace with real photo — 800 x 600"),
        ("quality-lab", 800, 600, "Quality Testing Laboratory", "Replace with real photo — 800 x 600"),
        ("warehouse", 800, 600, "Warehouse & Logistics Center", "Replace with real photo — 800 x 600"),
        ("r-and-d-center", 800, 600, "R&D Innovation Center", "Replace with real photo — 800 x 600"),
        ("raw-materials", 800, 600, "Raw Material Storage", "Replace with real photo — 800 x 600"),
    ],
    # Product process images
    "products": [
        ("bulk-barrels", 800, 600, "Bulk Packaging Line", "Replace with real photo — 800 x 600"),
        ("cartridge-line", 800, 600, "Cartridge Filling Line", "Replace with real photo — 800 x 600"),
    ],
    # Quality control images
    "quality": [
        ("testing-rig", 800, 600, "Tensile Testing Equipment", "Replace with real photo — 800 x 600"),
        ("inspection", 800, 600, "Final Quality Inspection", "Replace with real photo — 800 x 600"),
    ],
}

total = 0
for subdir, files in images.items():
    d = BASE / subdir if subdir else BASE
    d.mkdir(parents=True, exist_ok=True)
    for name, w, h, label, sublabel in files:
        path = d / f"{name}.svg"
        path.write_text(svg(w, h, label, sublabel), encoding="utf-8")
        total += 1
        print(f"  OK  {path.relative_to(BASE)}")

print(f"\nGenerated {total} placeholder images.")
