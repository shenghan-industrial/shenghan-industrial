"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { AIAssistant } from "./AIAssistant";
import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";
import { categories as staticCategories } from "@/data/categories";
import { getSubCategoryCode, getModelPrefix } from "@/data/categories";
import { genEnName, genEsName, catZhMap, subZhMap, analyzeChineseName, translateWithAIFallback } from "@/lib/translate-name";
import { Save, ArrowLeft } from "lucide-react";

// Shared EN→ES translation map
const ES_MAP: Record<string, string> = {
  Modern: "Moderno", Nordic: "Nórdico", Minimalist: "Minimalista", Luxury: "Lujo",
  "Genuine Leather": "Cuero Genuino", Fabric: "Tela", "Solid Wood": "Madera Maciza",
  "Stainless Steel": "Acero Inoxidable", Aluminum: "Aluminio", Marble: "Mármol",
  Sofa: "Sofá", "Dining Table": "Mesa de Comedor", Bed: "Cama", Mattress: "Colchón",
  Desk: "Escritorio", Chair: "Silla", Cabinet: "Armario",
  Light: "Lámpara", Fan: "Ventilador", Heater: "Calefactor", Sink: "Fregadero",
};

function translateES(en: string): string {
  if (!en) return "";
  return en.split(" ").map((w) => ES_MAP[w] || w).join(" ");
}

// Feature templates by category
const FEAT_TEMPLATES: Record<string, { en: string[]; zh: string[] }> = {
  Furniture: { en: ["Premium materials", "Expert workmanship", "ISO-certified", "Custom specs", "Export packaging"], zh: ["优质材料", "精湛工艺", "ISO认证", "支持定制", "出口包装"] },
  Lighting: { en: ["Energy-efficient LED", "Long lifespan", "Multiple color temps", "IP-rated durable"], zh: ["高效节能LED", "长寿命", "多色温可选", "IP防护"] },
  Hardware: { en: ["Corrosion-resistant", "Precision engineering", "TÜV-tested", "Industrial-grade"], zh: ["耐腐蚀", "精密工艺", "TÜV认证", "工业级耐用"] },
  "Building Materials": { en: ["High-performance", "Weather-resistant", "International standards", "Professional grade"], zh: ["高性能", "耐候持久", "国际标准", "专业级"] },
  Appliances: { en: ["Energy-efficient", "Safety-certified", "User-friendly", "Modern design"], zh: ["节能设计", "安全认证", "人性化操作", "现代设计"] },
  Others: { en: ["Factory direct", "Reliable performance", "Competitive pricing", "Bulk supply"], zh: ["工厂直供", "性能可靠", "价格竞争力", "大宗供应"] },
};

function generateProduct(nameZh: string, category: string, subCategory: string, image: string, price: string, notes: string, featuresInput: string): Product {
  const subZh = subZhMap[subCategory] || subCategory;
  const enName = genEnName(nameZh, subCategory);
  const esName = genEsName(nameZh, enName);
  const kw = analyzeChineseName(nameZh);
  const enType = kw.type || subCategory || "Product";
  const enStyle = kw.style;
  const enMaterial = kw.material;
  const esStyle = ES_MAP[enStyle] || enStyle;
  const esMaterial = ES_MAP[enMaterial] || enMaterial;
  const esType = ES_MAP[enType] || enType;
  const notesClean = notes?.replace(/[，,。；;、\s]+$/, "").trim() || "";

  const baseId = (category + "-" + (subCategory || "product") + "-" + nameZh)
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 40);
  const id = baseId + "-" + Date.now().toString(36);

  const ft = FEAT_TEMPLATES[category] || FEAT_TEMPLATES.Others;

  // Features
  const zhFeatures = featuresInput.trim()
    ? featuresInput.split(/\n+/).map((s) => s.trim()).filter(Boolean).slice(0, 10)
    : ft.zh;
  const enFeatures = featuresInput.trim()
    ? zhFeatures
        .map((f) => {
          const k = analyzeChineseName(f);
          return [k.style, k.material, k.type].filter(Boolean).join(" ") || "";
        })
        .filter(Boolean)
        .slice(0, 10)
    : ft.en;
  if (enFeatures.length === 0 && featuresInput.trim()) {
    // All features untranslatable — use defaults
    enFeatures.push(...ft.en);
  }
  const esFeatures = enFeatures.map(translateES);

  // Descriptions
  const zhDescription = notes
    ? `${notesClean}。${nameZh}，盛煜实业工厂直供。支持来样定制，ISO认证生产流程，出口标准包装。`
    : `${nameZh}，盛煜实业工厂直供。自有工厂严格品控，支持来样定制，ISO认证生产流程，出口标准包装。`;

  const enDescKeywords = [enStyle, enMaterial ? enMaterial.toLowerCase() : "", enType.toLowerCase()].filter(Boolean);
  const enDescLead = enDescKeywords.length > 0
    ? `${enDescKeywords.join(", ")} design.`
    : "Quality craftsmanship and functional design.";
  const enDescription = `${enName} — ${enDescLead} Factory direct from Shengyu Industrial. ISO-certified, custom specs available, export-grade packaging.`;

  const esDescKeywords = [esStyle?.toLowerCase(), esMaterial?.toLowerCase(), esType?.toLowerCase()].filter(Boolean);
  const esDescLead = esDescKeywords.length > 0
    ? `Diseño ${esDescKeywords.join(", ")}.`
    : "Calidad artesanal y diseño funcional.";
  const esDescription = `${esName} — ${esDescLead} Directo de fábrica de Shengyu Industrial. Certificación ISO, especificaciones personalizadas, embalaje de exportación.`;

  const enSubtitle = (enStyle ? enStyle + " " : "") + (enMaterial || subCategory || "Product") + " — factory direct";
  const zhSubtitle = (notesClean ? notesClean.substring(0, 30) + " — " : "") + subZh + " — 工厂直供品质";
  const esSubtitle = (esStyle ? esStyle + " " : "") + (esMaterial || subCategory || "Producto") + " — calidad directa";

  return {
    id,
    name: { en: enName, zh: nameZh, es: esName },
    category, subCategory: subCategory || undefined,
    description: { en: enDescription, zh: zhDescription, es: esDescription },
    features: { en: enFeatures, zh: zhFeatures, es: esFeatures },
    subtitle: { en: enSubtitle, zh: zhSubtitle, es: esSubtitle },
    specs: {
      en: [
        { label: "Material", value: enMaterial || "Premium grade" },
        { label: "MOQ", value: "Negotiable" },
        { label: "Lead Time", value: "25–35 days" },
        { label: "Customization", value: "Available" },
      ],
      zh: [
        { label: "材质", value: enMaterial || "优质等级" },
        { label: "起订量", value: "可协商" },
        { label: "交期", value: "25–35 天" },
        { label: "定制", value: "支持" },
      ],
      es: [
        { label: "Material", value: esMaterial || "Grado premium" },
        { label: "Cantidad Mínima", value: "Negociable" },
        { label: "Plazo de Entrega", value: "25–35 días" },
        { label: "Personalización", value: "Disponible" },
      ],
    },
    image: image || "/images/product-1.svg",
    price: price || "",
    partnerId: "shenghan-industrial",
  };
}

interface Props { product?: Product; isNew?: boolean; }

export function ProductForm({ product, isNew }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nameZh, setNameZh] = useState(product?.name?.zh || "");
  const [category, setCategory] = useState(product?.category || "Furniture");
  const [subCategory, setSubCategory] = useState(product?.subCategory || "");
  const [image, setImage] = useState(product?.image || "");
  const [extraImages, setExtraImages] = useState<string[]>(product?.images || []);
  const [price, setPrice] = useState(product?.price || "");
  const [model, setModel] = useState(product?.model || "");
  const [notes, setNotes] = useState(product?.notes || "");
  const [featuresInput, setFeaturesInput] = useState(product?.features?.zh?.join("\n") || "");
  const [aiPreview, setAiPreview] = useState<{ en: string; es: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && data.length > 0 ? setCategories(data) : setCategories(staticCategories))
      .catch(() => setCategories(staticCategories));
  }, []);

  // Auto AI-translate when user types Chinese name (debounced 1s)
  useEffect(() => {
    if (!nameZh.trim() || nameZh.trim().length < 2 || product) return; // Only auto for new products
    const timer = setTimeout(async () => {
      setAiLoading(true);
      const result = await translateWithAIFallback(nameZh.trim());
      setAiPreview(result);
      setAiLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [nameZh, product]);

  const allSubCategories: { name: string; nameZh: string; category: string }[] = [];
  for (const cat of (categories.length > 0 ? categories : staticCategories)) {
    const items = cat.children || cat.groups?.flatMap((g) => g.children) || [];
    for (const item of items) {
      if (item.productSubCategory) {
        allSubCategories.push({ name: item.productSubCategory, nameZh: item.nameZh, category: cat.productCategory });
      }
    }
  }

  const displayCats = categories.length > 0 ? categories : staticCategories;
  const subOptions = allSubCategories.filter((s) => s.category === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameZh.trim()) { alert("请输入产品中文名称"); return; }
    setSaving(true);

    let data: Product;
    const gen = generateProduct(nameZh.trim(), category, subCategory, image, price.trim(), notes.trim(), featuresInput.trim());
    // Apply AI translations if available
    if (aiPreview) {
      gen.name = { en: aiPreview.en, zh: nameZh.trim(), es: aiPreview.es };
    }
    // Auto-generate sequential model per subcategory: SY-{3-letter code}-{SEQ}
    const subCode = subCategory ? getSubCategoryCode(subCategory) : "XXX";
    const prefix = `SY-${subCode}`;
    let computedModel = model.trim();
    if (!computedModel) {
      try {
        const res = await fetch("/api/admin/products");
        const all: { model?: string; category?: string; subCategory?: string }[] = await res.json();
        const nums = all
          .filter(p => p.model?.startsWith(prefix + "-"))
          .map(p => parseInt(p.model!.split("-").pop() || "0", 10))
          .filter(n => !isNaN(n));
        const next = Math.max(0, ...nums) + 1;
        computedModel = `${prefix}-${String(next).padStart(3, "0")}`;
      } catch { computedModel = `${prefix}-001`; }
    }

    if (isNew) {
      data = { ...gen, images: extraImages.filter(Boolean), notes: notes.trim(), model: computedModel };
    } else {
      data = { ...gen, id: product!.id, partnerId: product!.partnerId, images: extraImages.filter(Boolean), notes: notes.trim(), model: computedModel };
    }

    try {
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${product!.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { setSaved(true); setSaving(false); return; }
      const err = await res.json().catch(() => ({ error: res.statusText }));
      alert("保存失败: " + (err.error || "未知错误"));
    } catch {
      alert("网络错误，请确认服务器在运行");
    }
    setSaving(false);
  };

  return (
    <div>
      {saved && (
        <div className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center justify-between">
          <span className="text-sm font-medium text-green-700 dark:text-green-400">保存成功</span>
          <button onClick={() => { const page = localStorage.getItem("admin-product-page") || "0"; router.push(`/admin?page=${page}`); setTimeout(() => router.refresh(), 200); }} className="text-xs text-[#B8A080] hover:underline">返回产品列表</button>
        </div>
      )}
      <div className="flex items-center gap-4 mb-6">
        <button type="button" onClick={() => router.push("/admin")} className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/5 text-[#6B6058] dark:text-white/40 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">
          {isNew ? "新增产品" : `编辑 — ${product?.name || ""}`}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-[#3D3730] dark:text-[#D4C8B8] mb-4">产品图片</h3>
              <p className="text-[11px] font-medium text-[#6B6058] dark:text-white/50 mb-2">主图</p>
              <ImageUpload value={image} onChange={setImage} />
              <p className="text-[11px] font-medium text-[#6B6058] dark:text-white/50 mt-5 mb-2">附加图片（最多5张）</p>
              <div className="space-y-2">
                {extraImages.map((img, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={img} onChange={(e) => { const next = [...extraImages]; next[i] = e.target.value; setExtraImages(next); }}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-xs text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080]" placeholder="图片URL" />
                    <button type="button" onClick={() => setExtraImages(extraImages.filter((_, j) => j !== i))}
                      className="p-1.5 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><span className="text-xs">×</span></button>
                  </div>
                ))}
                {extraImages.length < 5 && (
                  <button type="button" onClick={() => setExtraImages([...extraImages, ""])}
                    className="inline-flex items-center gap-1 text-xs text-[#B8A080] hover:text-[#A89070]">+ 添加图片</button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">产品名称（中文）*</label>
              <input type="text" value={nameZh} onChange={(e) => setNameZh(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors" placeholder="例如：现代L型真皮沙发" required />
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] text-[#B8A080]">英文和西班牙语名称将自动生成</p>
                <button type="button" onClick={async () => {
                  if (!nameZh.trim() || aiLoading) return;
                  setAiLoading(true);
                  const result = await translateWithAIFallback(nameZh.trim());
                  setAiPreview(result);
                  setAiLoading(false);
                }} className="text-[10px] text-[#C8A14C] hover:text-[#B8943A] underline font-medium">
                  {aiLoading ? "翻译中..." : aiPreview ? "✓ 已AI翻译" : "🤖 AI智能翻译"}
                </button>
              </div>
              {aiPreview && (
                <div className="mt-1.5 flex gap-3 text-[11px]">
                  <span className="text-[#6B6058] dark:text-white/50">EN: <strong>{aiPreview.en}</strong></span>
                  <span className="text-[#6B6058] dark:text-white/50">ES: <strong>{aiPreview.es}</strong></span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">产品型号</label>
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors" placeholder="例如：SY-JJ-LC-PC-01" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">品类</label>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors">
                  {displayCats.map((c) => <option key={c.productCategory} value={c.productCategory}>{c.nameZh}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">子品类</label>
                <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors">
                  <option value="">— 不限 —</option>
                  {subOptions.map((s) => <option key={s.name} value={s.name}>{s.nameZh}{s.nameZh !== s.name ? ` (${s.name})` : ""}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">价格</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors" placeholder="例如：$299 或留空" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">产品描述（备注）</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors resize-y"
                placeholder="输入产品的大体描述，系统会自动扩写成三语的产品描述" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">产品特点</label>
              <textarea value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} rows={4}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors resize-y"
                placeholder={"每行一个特点\n例如：\n黄麻纤维面料，抗湿透气抗菌\n欧洲3区静音独立支撑系统\n精工全环绕稳定围边"} />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-6">
          <h3 className="text-sm font-semibold text-[#3D3730] dark:text-[#D4C8B8] mb-3">预览</h3>
          <div className="flex gap-4 items-start">
            {image && <img src={image} alt={nameZh} className="w-24 h-24 rounded-lg object-contain border border-[#E8E2DC] dark:border-white/10 bg-gray-100" />}
            <div>
              <p className="font-bold text-[#3D3730] dark:text-[#D4C8B8]">{nameZh || "（产品名称）"}</p>
              <p className="text-xs text-[#9B8E7E] dark:text-white/30">{catZhMap[category] || category}{subCategory ? " / " + (subZhMap[subCategory] || subCategory) : ""}</p>
              {price && <p className="text-sm font-semibold text-[#B8A080] mt-1">{price}</p>}
              {isNew && nameZh && <p className="text-[10px] text-[#B8A080] mt-2">自动生成：三语名称、描述、特性、规格</p>}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : (isNew ? "创建产品" : "保存修改")}
          </button>
        </div>
      </form>

      <AIAssistant
        category={catZhMap[category] || category}
        subCategory={subCategory ? (subZhMap[subCategory] || subCategory) : undefined}
        context={nameZh ? `产品名: ${nameZh}${notes ? ", 备注: " + notes : ""}` : undefined}
        onApply={(aiData) => {
          if (aiData.code) setModel(aiData.code);
          if (aiData.name) setNameZh(aiData.name);
          if (aiData.description) setNotes(aiData.description);
          if (aiData.features?.length) setFeaturesInput(aiData.features.join("\n"));
        }}
      />
    </div>
  );
}
