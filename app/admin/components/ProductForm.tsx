"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import type { Product } from "@/data/products";
import { categories } from "@/data/categories";
import { Save, ArrowLeft } from "lucide-react";

function generateProduct(name: string, nameZh: string, category: string, subCategory: string, image: string, price: string, notes: string): Product {
  const id = (category + "-" + (subCategory || "product") + "-" + name)
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  const subZhMap: Record<string, string> = {
    Sofas: "沙发", Beds: "床", Cabinets: "柜子",
    Adhesives: "胶粘剂", Panels: "板材", Fasteners: "紧固件",
    "Door & Window": "门窗配件", Bathroom: "卫浴配件",
    Fans: "电风扇", Heaters: "取暖器", Kitchen: "厨房小家电",
    "Desk Lamps": "台灯", "Pendant Lights": "吊灯", "Floor Lamps": "落地灯",
  };
  const subZh = subZhMap[subCategory] || subCategory;
  const catZhMap: Record<string, string> = {
    Furniture: "家具", "Building Materials": "建材", Hardware: "五金",
    Appliances: "家电", Lighting: "灯具", Others: "其他",
  };
  const catZh = catZhMap[category] || category;
  const zhName = nameZh || name + " — " + subZh;
  const esName = name + " — " + subCategory;

  const featTemplates: Record<string, { en: string[]; zh: string[] }> = {
    Furniture: {
      en: ["Premium materials and expert workmanship", "ISO-certified production process", "Custom specifications available", "Export-standard packaging"],
      zh: ["优质材料与精湛工艺", "ISO认证生产流程", "支持定制规格", "出口标准包装"],
    },
    Lighting: {
      en: ["Energy-efficient LED technology", "Long lifespan and low maintenance", "Multiple color temperature options", "IP-rated for durability"],
      zh: ["高效节能LED技术", "长寿命低维护", "多色温可选", "IP防护等级持久耐用"],
    },
    Hardware: {
      en: ["Corrosion-resistant materials", "Precision engineering", "TÜV-tested quality standards", "Industrial-grade durability"],
      zh: ["耐腐蚀材质", "精密工艺", "TÜV检测品质标准", "工业级耐用性"],
    },
    "Building Materials": {
      en: ["High-performance formulation", "Weather-resistant and durable", "Meets international standards", "Professional-grade quality"],
      zh: ["高性能配方", "耐候持久", "符合国际标准", "专业级品质"],
    },
    Appliances: {
      en: ["Energy-efficient design", "Safety-certified components", "User-friendly operation", "Modern aesthetic"],
      zh: ["节能设计", "安全认证组件", "人性化操作", "现代美学外观"],
    },
    Others: {
      en: ["Factory direct quality", "Reliable performance", "Competitive pricing", "Bulk supply available"],
      zh: ["工厂直供品质", "性能可靠", "价格竞争力", "大宗供应"],
    },
  };
  const ft = featTemplates[category] || featTemplates.Others;

  return {
    id, name,
    nameZh: zhName,
    nameEs: esName,
    subtitle: subCategory + " — factory direct quality",
    subtitleZh: subZh + " — 工厂直供品质",
    subtitleEs: subCategory + " — calidad directa de fábrica",
    category, subCategory: subCategory || undefined,
    description: notes
      ? `${notes}. ${subCategory} — ${name}. Factory direct from Shengyu Industrial.`
      : `Shengyu Industrial ${subCategory?.toLowerCase() || ""} — ${name}. Manufactured in our own facilities with strict quality control.`,
    descriptionZh: notes
      ? `${notes}。${subZh} — ${zhName}。盛煜实业工厂直供。`
      : `盛煜实业 ${subZh} — ${zhName}。自有工厂制造，严格品控。`,
    descriptionEs: notes
      ? `${notes}. ${subCategory} — ${esName}. Directo de fábrica de Shengyu Industrial.`
      : `Shengyu Industrial ${subCategory?.toLowerCase() || ""} — ${esName}. Fabricado en nuestras propias instalaciones con estricto control de calidad.`,
    features: ft.en, featuresZh: ft.zh, featuresEs: ft.en,
    specs: [
      { label: "Material", value: "Premium grade" },
      { label: "MOQ", value: "Negotiable" },
      { label: "Lead Time", value: "25–35 days" },
      { label: "Customization", value: "Available" },
    ],
    specsZh: [
      { label: "材质", value: "优质等级" },
      { label: "起订量", value: "可协商" },
      { label: "交期", value: "25–35 天" },
      { label: "定制", value: "支持" },
    ],
    specsEs: [
      { label: "Material", value: "Grado premium" },
      { label: "Cantidad Mínima", value: "Negociable" },
      { label: "Plazo de Entrega", value: "25–35 días" },
      { label: "Personalización", value: "Disponible" },
    ],
    image: image || "/images/product-1.svg",
    price: price || "",
    partnerId: "shenghan-industrial",
  };
}

const allSubCategories: { name: string; category: string }[] = [];
for (const cat of categories) {
  const items = cat.children || cat.groups?.flatMap((g) => g.children) || [];
  for (const item of items) {
    if (item.productSubCategory) allSubCategories.push({ name: item.productSubCategory, category: cat.productCategory });
  }
}

interface Props { product?: Product; isNew?: boolean; }

export function ProductForm({ product, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [nameZh, setNameZh] = useState(product?.nameZh || "");
  const [category, setCategory] = useState(product?.category || "Furniture");
  const [subCategory, setSubCategory] = useState(product?.subCategory || "");
  const [image, setImage] = useState(product?.image || "");
  const [extraImages, setExtraImages] = useState<string[]>(product?.images || []);
  const [price, setPrice] = useState(product?.price || "");
  const [notes, setNotes] = useState(product?.notes || "");

  const subOptions = allSubCategories.filter((s) => s.category === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    let data: Product;
    if (isNew) {
      data = { ...generateProduct(name.trim(), nameZh.trim(), category, subCategory, image, price.trim(), notes.trim()), images: extraImages.filter(Boolean), notes: notes.trim() };
    } else {
      data = { ...product!, name: name.trim(), nameZh: nameZh.trim(), category, subCategory, image, images: extraImages.filter(Boolean), price: price.trim(), notes: notes.trim() };
    }

    const url = isNew ? "/api/admin/products" : `/api/admin/products/${product!.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

    if (res.ok) { router.push("/admin"); router.refresh(); }
    else { alert("保存失败"); setSaving(false); }
  };

  return (
    <div>
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
          {/* Left: Images */}
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-[#3D3730] dark:text-[#D4C8B8] mb-4">产品图片</h3>
              <p className="text-[11px] font-medium text-[#6B6058] dark:text-white/50 mb-2">主图</p>
              <ImageUpload value={image} onChange={setImage} />
              <p className="text-[11px] font-medium text-[#6B6058] dark:text-white/50 mt-5 mb-2">附加图片（最多5张）</p>
              <div className="space-y-2">
                {extraImages.map((img, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={img} onChange={(e) => {
                      const next = [...extraImages]; next[i] = e.target.value; setExtraImages(next);
                    }} className="flex-1 px-3 py-2 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-xs text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080]" placeholder="图片URL" />
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

          {/* Right: Info */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">产品名称（英文）*</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors" placeholder="例如：Modern L-Shape Sofa" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">产品名称（中文）</label>
              <input type="text" value={nameZh} onChange={(e) => setNameZh(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors" placeholder="例如：现代L型沙发" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">品类</label>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }} className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors">
                  {categories.map((c) => <option key={c.productCategory} value={c.productCategory}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">子品类</label>
                <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors">
                  <option value="">— 不限 —</option>
                  {subOptions.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">价格</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors" placeholder="例如：$299 或留空" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">备注</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] transition-colors resize-y" placeholder="内部备注（不公开展示）" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-6">
          <h3 className="text-sm font-semibold text-[#3D3730] dark:text-[#D4C8B8] mb-3">预览</h3>
          <div className="flex gap-4 items-start">
            {image && <img src={image} alt={name} className="w-24 h-24 rounded-lg object-contain border border-[#E8E2DC] dark:border-white/10 bg-gray-100" />}
            <div>
              <p className="font-bold text-[#3D3730] dark:text-[#D4C8B8]">{name || "（产品名称）"}</p>
              <p className="text-xs text-[#9B8E7E] dark:text-white/30">{category}{subCategory ? " / " + subCategory : ""}</p>
              {price && <p className="text-sm font-semibold text-[#B8A080] mt-1">{price}</p>}
              {isNew && name && <p className="text-[10px] text-[#B8A080] mt-2">自动生成：三语描述、特性、规格（基于品类模板）</p>}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : (isNew ? "创建产品" : "保存修改")}
          </button>
        </div>
      </form>
    </div>
  );
}
