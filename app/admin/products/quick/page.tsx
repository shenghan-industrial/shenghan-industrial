"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { Zap, Loader2, Check } from "lucide-react";

const subMap: { name: string; cat: string }[] = [];
categories.forEach(c => {
  (c.children || c.groups?.flatMap(g => g.children) || []).forEach(child => {
    if (child.productSubCategory) subMap.push({ name: child.productSubCategory, cat: c.productCategory });
  });
});

export default function QuickAddPage() {
  const router = useRouter();
  const [category, setCategory] = useState("Furniture");
  const [subCategory, setSubCategory] = useState("");
  const [imagePrefix, setImagePrefix] = useState("/images/products/");
  const [price, setPrice] = useState("");
  const [list, setList] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const subOptions = subMap.filter(s => s.cat === category);

  const handleGenerate = async () => {
    const lines = list.trim().split("\n").filter(l => l.trim());
    if (lines.length === 0) return;
    setLoading(true);
    let imported = 0;
    const errors: string[] = [];

    for (const line of lines) {
      // Format: 中文名称，简要描述（可选）
      const parts = line.split(/[,，]/).map(s => s.trim());
      const nameZh = parts[0];
      const notesZh = parts[1] || "";

      if (!nameZh) { errors.push(`跳过空行: "${line}"`); continue; }

      try {
        const res = await fetch("/api/admin/products/quick", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nameZh, notesZh, category, subCategory: subCategory || undefined, imagePrefix, price }),
        });
        if (res.ok) imported++;
        else { const err = await res.json(); errors.push(`${nameZh}: ${err.error || "失败"}`); }
      } catch { errors.push(`${nameZh}: 网络错误`); }
    }

    setResult(`✅ 成功导入 ${imported} 个\n` + (errors.length ? `⚠️ ${errors.length} 个失败:\n${errors.join("\n")}` : ""));
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">快速批量添加</h1>
          <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1">只需输入中文名称，英文和西班牙语自动生成</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8] mb-3">默认设置（应用于全部）</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-[#9B8E7E] dark:text-white/30 mb-1">品类</label>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }}
              className="w-full px-3 py-2 rounded-lg border text-sm">
              {categories.map(c => <option key={c.productCategory} value={c.productCategory}>{c.nameZh || c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#9B8E7E] dark:text-white/30 mb-1">子品类</label>
            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm">
              <option value="">不限</option>
              {subOptions.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#9B8E7E] dark:text-white/30 mb-1">统一价格</label>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="如 $299"
              className="w-full px-3 py-2 rounded-lg border text-sm" />
          </div>
          <div>
            <label className="block text-xs text-[#9B8E7E] dark:text-white/30 mb-1">图片路径前缀</label>
            <input type="text" value={imagePrefix} onChange={(e) => setImagePrefix(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8] mb-2">产品列表</h3>
        <p className="text-xs text-[#9B8E7E] dark:text-white/30 mb-3">
          每行一个产品，格式：<code className="px-1.5 py-0.5 bg-[#F5F2EF] dark:bg-brand-800 rounded text-[#B8A080]">中文名称，简要描述</code>（描述可省略，英文和西班牙语自动翻译）
        </p>
        <textarea
          value={list}
          onChange={(e) => setList(e.target.value)}
          placeholder={`粘贴中文产品名称，一行一个：\n\n现代L型真皮沙发，高密度海绵填充进口头层牛皮\n北欧简约实木餐桌，白橡木材质极简设计\n智能LED吊灯，三色温遥控调光客厅卧室通用\n电动升降办公桌，双电机静音记忆高度\n不锈钢厨房水槽，304加厚手工打造双槽`}
          rows={10}
          className="w-full px-4 py-3 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm resize-y font-mono"
        />
      </div>

      <button onClick={handleGenerate} disabled={!list.trim() || loading}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] disabled:opacity-50 shadow-sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {loading ? "导入中..." : `一键生成（${list.trim().split("\n").filter(l => l.trim()).length} 个）`}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-white border">
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          <button onClick={() => { router.push("/admin"); router.refresh(); }}
            className="mt-3 inline-flex items-center gap-1 text-xs text-[#B8A080] hover:text-[#A89070] font-medium">
            <Check className="w-3.5 h-3.5" /> 返回产品列表
          </button>
        </div>
      )}
    </div>
  );
}
