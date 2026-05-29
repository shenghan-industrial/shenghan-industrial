const fs = require("fs");
const path = require("path");

const BASE = "D:/跨境001/public/images";
["factory", "products", "quality"].forEach((d) =>
  fs.mkdirSync(path.join(BASE, d), { recursive: true })
);

// Photo-realistic placeholder with varied compositions
function photoCard(w, h, scene) {
  const { bg1, bg2, overlayColor, label, sublabel, badge } = scene;
  const shapes = typeof scene.shapes === "function" ? scene.shapes(w, h) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="over" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${overlayColor}" stop-opacity="0.7"/>
      <stop offset="40%" stop-color="${overlayColor}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </linearGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feBlend in="SourceGraphic" mode="multiply" result="n"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)" filter="url(#noise)" opacity="0.3"/>
  ${shapes}
  <rect width="${w}" height="${h}" fill="url(#over)"/>
  ${badge ? `<rect x="16" y="16" width="${badge.length * 9 + 20}" height="28" rx="6" fill="rgba(0,0,0,0.45)"/>
  <text x="26" y="35" fill="#fff" font-size="11" font-family="system-ui,sans-serif" font-weight="600">${badge}</text>` : ""}
  <text x="${w/2}" y="${h-36}" text-anchor="middle" fill="#fff" font-size="${w > 1000 ? 22 : 17}" font-family="system-ui,sans-serif" font-weight="700" opacity="0.95">${label}</text>
  <text x="${w/2}" y="${h-14}" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="${w > 1000 ? 13 : 11}" font-family="system-ui,sans-serif">${sublabel}</text>
</svg>`;
}

// Factory scenes - industrial shots (shapes are functions of w,h)
const factoryLine = (w, h) => `<rect x="0" y="${h/2-40}" width="${w}" height="160" fill="rgba(255,255,255,0.04)"/>
    <rect x="${w*0.1}" y="${h/2-60}" width="${w*0.25}" height="80" rx="4" fill="rgba(255,255,255,0.06)"/>
    <rect x="${w*0.4}" y="${h/2-50}" width="${w*0.3}" height="60" rx="4" fill="rgba(255,255,255,0.05)"/>
    <rect x="${w*0.75}" y="${h/2-45}" width="${w*0.15}" height="70" rx="4" fill="rgba(255,255,255,0.06)"/>
    <circle cx="${w*0.15}" cy="${h/2-100}" r="30" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <line x1="0" y1="${h/2-20}" x2="${w}" y2="${h/2-20}" stroke="rgba(200,161,76,0.15)" stroke-width="6"/>`;

const qualityLab = (w, h) => `<rect x="${w*0.05}" y="${h*0.2}" width="${w*0.4}" height="${h*0.5}" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <rect x="${w*0.55}" y="${h*0.2}" width="${w*0.35}" height="${h*0.35}" rx="8" fill="rgba(255,255,255,0.06)"/>
    <circle cx="${w*0.25}" cy="${h*0.35}" r="20" fill="none" stroke="rgba(200,161,76,0.15)" stroke-width="2"/>
    <line x1="${w*0.25}" y1="${h*0.35}" x2="${w*0.25}" y2="${h*0.55}" stroke="rgba(200,161,76,0.1)" stroke-width="2"/>
    <circle cx="${w*0.7}" cy="${h*0.3}" r="12" fill="rgba(200,161,76,0.08)"/>`;

const warehouse = (w, h) => `<rect x="0" y="${h*0.15}" width="${w}" height="${h*0.7}" fill="rgba(255,255,255,0.03)"/>
    <line x1="0" y1="${h*0.3}" x2="${w}" y2="${h*0.3}" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
    <line x1="0" y1="${h*0.6}" x2="${w}" y2="${h*0.6}" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
    <rect x="${w*0.05}" y="${h*0.15}" width="${w*0.2}" height="${h*0.15}" rx="3" fill="rgba(255,255,255,0.08)"/>
    <rect x="${w*0.3}" y="${h*0.15}" width="${w*0.2}" height="${h*0.15}" rx="3" fill="rgba(255,255,255,0.1)"/>
    <rect x="${w*0.55}" y="${h*0.15}" width="${w*0.2}" height="${h*0.15}" rx="3" fill="rgba(255,255,255,0.07)"/>
    <rect x="${w*0.1}" y="${h*0.35}" width="${w*0.15}" height="${h*0.25}" rx="3" fill="rgba(200,161,76,0.06)"/>`;

const rdCenter = (w, h) => `<circle cx="${w*0.4}" cy="${h*0.35}" r="45" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="${w*0.4}" cy="${h*0.35}" r="25" fill="rgba(200,161,76,0.06)"/>
    <rect x="${w*0.1}" y="${h*0.15}" width="${w*0.2}" height="${h*0.12}" rx="4" fill="rgba(255,255,255,0.05)"/>
    <rect x="${w*0.6}" y="${h*0.4}" width="${w*0.3}" height="${h*0.3}" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <line x1="${w*0.65}" y1="${h*0.5}" x2="${w*0.85}" y2="${h*0.5}" stroke="rgba(200,161,76,0.12)" stroke-width="1"/>
    <line x1="${w*0.65}" y1="${h*0.55}" x2="${w*0.8}" y2="${h*0.55}" stroke="rgba(200,161,76,0.1)" stroke-width="1"/>`;

const rawMaterials = (w, h) => `<rect x="${w*0.05}" y="${h*0.3}" width="${w*0.18}" height="${h*0.4}" rx="4" fill="rgba(255,255,255,0.06)"/>
    <rect x="${w*0.25}" y="${h*0.25}" width="${w*0.2}" height="${h*0.45}" rx="4" fill="rgba(255,255,255,0.08)"/>
    <rect x="${w*0.47}" y="${h*0.3}" width="${w*0.18}" height="${h*0.4}" rx="4" fill="rgba(255,255,255,0.05)"/>
    <rect x="${w*0.67}" y="${h*0.2}" width="${w*0.22}" height="${h*0.5}" rx="4" fill="rgba(255,255,255,0.07)"/>
    <circle cx="${w*0.15}" cy="${h*0.15}" r="8" fill="rgba(200,161,76,0.08)"/>`;

const bulkBarrels = (w, h) => `<ellipse cx="${w*0.25}" cy="${h*0.45}" rx="50" ry="65" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
    <ellipse cx="${w*0.25}" cy="${h*0.3}" rx="50" ry="20" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <ellipse cx="${w*0.5}" cy="${h*0.45}" rx="42" ry="55" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
    <ellipse cx="${w*0.5}" cy="${h*0.33}" rx="42" ry="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <ellipse cx="${w*0.72}" cy="${h*0.45}" rx="48" ry="62" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.07)" stroke-width="2"/>`;

const cartridgeLine = (w, h) => `<rect x="${w*0.08}" y="${h*0.2}" width="20" height="${h*0.5}" rx="3" fill="rgba(255,255,255,0.06)"/>
    <rect x="${w*0.2}" y="${h*0.15}" width="20" height="${h*0.55}" rx="3" fill="rgba(255,255,255,0.08)"/>
    <rect x="${w*0.35}" y="${h*0.2}" width="20" height="${h*0.5}" rx="3" fill="rgba(255,255,255,0.07)"/>
    <rect x="${w*0.5}" y="${h*0.1}" width="20" height="${h*0.6}" rx="3" fill="rgba(255,255,255,0.06)"/>
    <rect x="${w*0.65}" y="${h*0.18}" width="20" height="${h*0.52}" rx="3" fill="rgba(255,255,255,0.08)"/>
    <rect x="${w*0.8}" y="${h*0.22}" width="20" height="${h*0.48}" rx="3" fill="rgba(255,255,255,0.06)"/>
    <line x1="0" y1="${h*0.45}" x2="${w}" y2="${h*0.45}" stroke="rgba(200,161,76,0.1)" stroke-width="3"/>`;

const testingRig = (w, h) => `<rect x="${w*0.1}" y="${h*0.1}" width="${w*0.8}" height="${h*0.65}" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <rect x="${w*0.15}" y="${h*0.5}" width="${w*0.7}" height="15" rx="5" fill="rgba(255,255,255,0.06)"/>
    <rect x="${w*0.35}" y="${h*0.3}" width="${w*0.3}" height="${h*0.2}" rx="3" fill="rgba(200,161,76,0.06)" stroke="rgba(200,161,76,0.12)" stroke-width="1"/>
    <line x1="${w*0.2}" y1="${h*0.2}" x2="${w*0.5}" y2="${h*0.3}" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
    <line x1="${w*0.5}" y1="${h*0.3}" x2="${w*0.8}" y2="${h*0.2}" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
    <circle cx="${w*0.5}" cy="${h*0.55}" r="15" fill="rgba(200,161,76,0.08)"/>`;

const inspection = (w, h) => `<rect x="${w*0.05}" y="${h*0.15}" width="${w*0.35}" height="${h*0.45}" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    <rect x="${w*0.45}" y="${h*0.1}" width="${w*0.35}" height="${h*0.5}" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="${w*0.25}" cy="${h*0.35}" r="15" fill="rgba(200,161,76,0.06)"/>
    <circle cx="${w*0.6}" cy="${h*0.3}" r="13" fill="rgba(200,161,76,0.08)"/>
    <line x1="${w*0.15}" y1="${h*0.55}" x2="${w*0.35}" y2="${h*0.55}" stroke="rgba(200,161,76,0.15)" stroke-width="2"/>`;

const product1 = (w, h) => `<rect x="${w*0.2}" y="${h*0.1}" width="${w*0.6}" height="${h*0.65}" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(200,161,76,0.1)" stroke-width="1"/>
    <rect x="${w*0.3}" y="${h*0.05}" width="${w*0.4}" height="20" rx="4" fill="rgba(200,161,76,0.1)"/>
    <circle cx="${w*0.5}" cy="${h*0.4}" r="40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
    <text x="${w*0.5}" y="${h*0.44}" text-anchor="middle" fill="rgba(200,161,76,0.4)" font-size="40" font-family="system-ui,sans-serif" font-weight="900">SG</text>`;

const product2 = (w, h) => `<path d="M${w*0.3},${h*0.05} L${w*0.7},${h*0.05} L${w*0.8},${h*0.8} L${w*0.2},${h*0.8} Z" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
    <path d="M${w*0.35},${h*0.15} L${w*0.65},${h*0.15} L${w*0.7},${h*0.7} L${w*0.3},${h*0.7} Z" fill="rgba(255,255,255,0.04)"/>
    <text x="${w*0.5}" y="${h*0.5}" text-anchor="middle" fill="rgba(200,161,76,0.3)" font-size="36" font-family="system-ui,sans-serif" font-weight="900">WS</text>`;

const product3 = (w, h) => `<rect x="${w*0.15}" y="${h*0.1}" width="${w*0.3}" height="${h*0.4}" rx="6" fill="rgba(255,255,255,0.05)"/>
    <rect x="${w*0.35}" y="${h*0.05}" width="${w*0.3}" height="${h*0.45}" rx="6" fill="rgba(255,255,255,0.07)"/>
    <rect x="${w*0.55}" y="${h*0.08}" width="${w*0.3}" height="${h*0.42}" rx="6" fill="rgba(255,255,255,0.05)"/>
    <text x="${w*0.5}" y="${h*0.6}" text-anchor="middle" fill="rgba(200,161,76,0.35)" font-size="36" font-family="system-ui,sans-serif" font-weight="900">SA</text>`;

const product4 = (w, h) => `<rect x="${w*0.25}" y="${h*0.1}" width="${w*0.5}" height="${h*0.6}" rx="8" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
    <rect x="${w*0.3}" y="${h*0.15}" width="${w*0.4}" height="${h*0.5}" rx="4" fill="rgba(255,255,255,0.04)"/>
    <line x1="${w*0.3}" y1="${h*0.35}" x2="${w*0.7}" y2="${h*0.35}" stroke="rgba(200,161,76,0.1)" stroke-width="1"/>
    <line x1="${w*0.3}" y1="${h*0.45}" x2="${w*0.7}" y2="${h*0.45}" stroke="rgba(200,161,76,0.08)" stroke-width="1"/>
    <text x="${w*0.5}" y="${h*0.7}" text-anchor="middle" fill="rgba(200,161,76,0.35)" font-size="32" font-family="system-ui,sans-serif" font-weight="900">IG</text>`;

const heroBg = (w, h) => `<rect x="0" y="${h*0.5}" width="${w}" height="${h*0.5}" fill="rgba(255,255,255,0.015)"/>
    <line x1="0" y1="${h*0.4}" x2="${w}" y2="${h*0.4}" stroke="rgba(200,161,76,0.08)" stroke-width="1"/>
    <line x1="0" y1="${h*0.7}" x2="${w}" y2="${h*0.7}" stroke="rgba(200,161,76,0.06)" stroke-width="1"/>
    <circle cx="${w*0.15}" cy="${h*0.3}" r="${h*0.25}" fill="none" stroke="rgba(200,161,76,0.04)" stroke-width="1"/>
    <circle cx="${w*0.85}" cy="${h*0.5}" r="${h*0.3}" fill="none" stroke="rgba(200,161,76,0.03)" stroke-width="1"/>`;

const scenes = [
  ["", "product-1", "#1e3545", "#0d2838", "#061020", product1, "SG-9000 Structural Sealant", "Two-component · Super high-rise curtain walls", "BEST SELLER"],
  ["", "product-2", "#2a3a4e", "#1a2a3e", "#0a1420", product2, "WS-7000 Weatherproof Sealant", "One-component · Professional joint sealing", ""],
  ["", "product-3", "#3d3025", "#2e2218", "#181008", product3, "SA-5000 Epoxy Stone Adhesive", "Two-component · Stone curtain wall anchoring", "NEW"],
  ["", "product-4", "#1e2e3e", "#0e1e2e", "#060e18", product4, "IG-8000 Insulating Glass Sealant", "Two-component · IG unit secondary seal", ""],
  ["", "factory-bg", "#0A1628", "#152A4A", "#050D18", heroBg, "Henggu Materials", "80,000 m² Modern Manufacturing Base | 8 Production Lines | CNAS Accredited", ""],
  ["factory", "factory-line", "#2a3a4a", "#1e3040", "#0a1018", factoryLine, "Automated Production Line", "8 lines · 24/7 operation · ISO 9001 certified", "PRODUCTION LINE"],
  ["factory", "quality-lab", "#2a3a3a", "#1e3030", "#0a1818", qualityLab, "Quality Testing Laboratory", "CNAS accredited · 50+ instruments · ISO 17025", "CNAS LABORATORY"],
  ["factory", "warehouse", "#3d3528", "#2e2820", "#181410", warehouse, "Smart Warehouse & Logistics", "Climate-controlled · Real-time tracking · Global shipping", "WAREHOUSE"],
  ["factory", "r-and-d-center", "#2e2e3e", "#1e1e2e", "#0e0e18", rdCenter, "R&D Innovation Center", "20+ patents · Formula development · Application testing", "R&D CENTER"],
  ["factory", "raw-materials", "#3d3028", "#2e2520", "#181210", rawMaterials, "Raw Material Management", "Premium silicone polymers · Certified suppliers only", "RAW MATERIALS"],
  ["products", "bulk-barrels", "#2a3a4e", "#1e2e3e", "#0a1820", bulkBarrels, "Bulk Packaging Line", "200L drums · 1000L IBC totes · Nitrogen-sealed", "BULK PACKAGING"],
  ["products", "cartridge-line", "#2a3e2a", "#1e2e1e", "#0a180a", cartridgeLine, "Cartridge Filling Line", "300ml & 500ml · High-speed · Automatic assembly", "CARTRIDGE LINE"],
  ["quality", "testing-rig", "#2e3a3e", "#1e2a2e", "#0a1418", testingRig, "Tensile Testing Laboratory", "ASTM / EN / GB standards · Computer-controlled", "TENSILE TESTING"],
  ["quality", "inspection", "#2e3a2e", "#1e2e1e", "#0a160a", inspection, "Final Quality Inspection", "Multi-point sampling · Adhesion tests · COA issued", "FINAL INSPECTION"],
];

let total = 0;
scenes.forEach(([subdir, name, bg1, bg2, overlayColor, shapesFn, label, sublabel, badge]) => {
  const dir = path.join(BASE, subdir);
  fs.mkdirSync(dir, { recursive: true });
  const [width, height] = name === "factory-bg" ? [1600, 900] : [800, 600];
  const s = { bg1, bg2, overlayColor, shapes: shapesFn, label, sublabel, badge };
  fs.writeFileSync(path.join(dir, `${name}.svg`), photoCard(width, height, s));
  total++;
});

console.log(`Generated ${total} photo-realistic placeholders`);
