"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, Check, Loader2, AlertCircle } from "lucide-react";

const CSV_HEADER = "name,nameZh,category,subCategory,image,price,notes";
const SAMPLE = [
  "Modern Fabric Sofa,现代布艺沙发,Furniture,Sofas,/images/products/your-image.webp,$299,High-density foam with premium velvet upholstery and solid wood frame",
  "LED Desk Lamp,LED台灯,Lighting,Desk Lamps,/images/products/your-image.webp,$45,Adjustable arm with 3 color temperatures and USB charging port",
  "Wood Adhesive,木材胶粘剂,Building Materials,Adhesives,/images/products/your-image.webp,$18,High-strength waterproof formula for indoor and outdoor use",
].join("\n");

export default function ImportProductsPage() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setCsv(ev.target?.result as string || "");
    reader.readAsText(f);
  };

  const handlePaste = () => { navigator.clipboard.readText().then(t => setCsv(t)).catch(() => {}); };

  const handleImport = async () => {
    if (!csv.trim()) return;
    setImporting(true); setResult(null);
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csv.trim() }),
      });
      const data = await res.json();
      setResult(data);
      if (data.imported > 0) setCsv("");
    } catch { setResult({ imported: 0, errors: ["网络错误"] }); }
    setImporting(false);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_HEADER + "\n" + SAMPLE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "product-import-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">批量导入</h1>
          <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1">上传CSV文件或粘贴数据，批量导入产品</p>
        </div>
        <button onClick={handleDownloadTemplate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E8E2DC] dark:border-white/10 text-sm font-medium text-[#6B6058] dark:text-white/40 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors">
          <Download className="w-4 h-4" />下载模板
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-5 mb-4">
        <h3 className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8] mb-2">CSV格式说明</h3>
        <p className="text-xs text-[#9B8E7E] dark:text-white/30 mb-3">
          字段：<code className="px-1.5 py-0.5 bg-[#F5F2EF] dark:bg-brand-800 rounded text-[#B8A080]">name, nameZh, category, subCategory, image, price, notes</code>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div><span className="text-[#B8A080] font-semibold">name</span> <span className="text-[#9B8E7E]">英文名称 *</span></div>
          <div><span className="text-[#B8A080] font-semibold">nameZh</span> <span className="text-[#9B8E7E]">中文名称</span></div>
          <div><span className="text-[#B8A080] font-semibold">category</span> <span className="text-[#9B8E7E]">品类（Furniture / Building Materials / Hardware / Lighting / Appliances / Others）</span></div>
          <div><span className="text-[#B8A080] font-semibold">subCategory</span> <span className="text-[#9B8E7E]">子品类（Sofas / Beds / Adhesives / Desk Lamps ...）</span></div>
          <div><span className="text-[#B8A080] font-semibold">image</span> <span className="text-[#9B8E7E]">图片路径/URL</span></div>
          <div><span className="text-[#B8A080] font-semibold">price</span> <span className="text-[#9B8E7E]">价格（如 $299）</span></div>
          <div><span className="text-[#B8A080] font-semibold">notes</span> <span className="text-[#9B8E7E]">简要描述，自动扩展为三语商品介绍</span></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8]">上传CSV</h3>
          <div className="flex gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 text-xs font-medium text-[#6B6058] dark:text-white/40 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors">
              <Upload className="w-3.5 h-3.5" />{file ? file.name : "选择文件"}
              <input type="file" accept=".csv,.txt,text/csv" onChange={handleFileChange} className="hidden" />
            </label>
            <button onClick={handlePaste} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 text-xs font-medium text-[#6B6058] dark:text-white/40 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors">
              从剪贴板粘贴
            </button>
          </div>
        </div>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)}
          placeholder={`在此粘贴CSV数据，或上传文件...\n\n示例：\n${SAMPLE}`} rows={8}
          className="w-full px-4 py-3 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#B8A080] transition-colors resize-y font-mono"
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleImport} disabled={!csv.trim() || importing}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-all disabled:opacity-50 shadow-sm">
          {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {importing ? "导入中..." : "开始导入"}
        </button>
        <span className="text-xs text-[#9B8E7E] dark:text-white/30">
          {csv.trim() ? `${csv.trim().split("\n").filter(l => l.trim()).length} 行数据` : ""}
        </span>
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-xl border ${result.errors.length === 0 ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30" : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30"}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.errors.length === 0 ? <Check className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-amber-600" />}
            <span className="font-bold text-sm text-[#3D3730] dark:text-white">已导入 {result.imported} 个产品</span>
          </div>
          {result.errors.length > 0 && (
            <ul className="space-y-1">{result.errors.map((err, i) => <li key={i} className="text-xs text-red-600 dark:text-red-400">{err}</li>)}</ul>
          )}
          {result.imported > 0 && (
            <button onClick={() => { router.push("/admin"); router.refresh(); }} className="mt-3 text-xs text-[#B8A080] hover:text-[#A89070] font-medium">查看产品列表 →</button>
          )}
        </div>
      )}
    </div>
  );
}
