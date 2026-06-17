"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, Loader2, Check, Image, Edit, X } from "lucide-react";

export default function BatchUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ url: string; filename: string; productId?: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const imgs = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((p) => [...p, ...imgs]);
  };

  const removeFile = (i: number) => {
    setFiles((p) => p.filter((_, idx) => idx !== i));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const res: typeof results = [];

    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!r.ok) { res.push({ url: "", filename: file.name }); continue; }
        const data = await r.json();

        // Create draft product with just the image
        const timestamp = Date.now();
        const productId = `draft-${timestamp}-${Math.random().toString(36).slice(2, 6)}`;
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: productId,
            name: `Draft - ${file.name}`,
            nameZh: `草稿 - ${file.name.split(".")[0]}`,
            nameEs: "",
            category: "Others",
            image: data.url,
            subtitle: "",
            description: "",
            descriptionZh: "",
            descriptionEs: "",
            features: [],
            featuresZh: [],
            featuresEs: [],
            specs: [],
            specsZh: [],
            specsEs: [],
            partnerId: "shenghan-industrial",
          }),
        });

        res.push({ url: data.url, filename: file.name, productId });
      } catch {
        res.push({ url: "", filename: file.name });
      }
    }

    setResults(res);
    setFiles([]);
    setUploading(false);
  };

  const done = results.filter((r) => r.url).length;
  const failed = results.filter((r) => !r.url).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">批量上传产品图片</h1>
        <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1">拖入多张产品图片，一键上传生成草稿，后续编辑填写详细信息</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`mb-5 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragOver ? "border-[#B8A080] bg-[#B8A080]/5" : "border-[#E8E2DC] dark:border-white/10 hover:border-[#B8A080]/40"
        }`}
      >
        <Image className="w-10 h-10 text-[#B8A080]/40 mx-auto mb-3" />
        <p className="text-sm font-medium text-[#3D3730] dark:text-white">拖拽或点击上传产品图片</p>
        <p className="text-xs text-[#9B8E7E] dark:text-white/30 mt-1">支持 JPG/PNG/WEBP，可一次选择多张</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => addFiles(e.target.files)} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mb-5 bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8]">
              待上传 {files.length} 张图片
            </h3>
            <button onClick={() => setFiles([])} className="text-xs text-[#9B8E7E] hover:text-red-500">清空</button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {files.map((f, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(f)} alt={f.name}
                  className="w-full aspect-square object-cover rounded-lg border border-[#E8E2DC] dark:border-white/5" />
                <button onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" /></button>
                <p className="text-[10px] text-[#9B8E7E] truncate mt-1">{f.name}</p>
              </div>
            ))}
          </div>
          <button onClick={handleUpload} disabled={uploading}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors disabled:opacity-50">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "上传中..." : `开始上传 ${files.length} 张图片`}
          </button>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8]">
              完成 — {done} 张成功{failed > 0 ? `，${failed} 张失败` : ""}
            </span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
            {results.filter((r) => r.url).map((r, i) => (
              <div key={i} className="relative group">
                <img src={r.url} alt={r.filename}
                  className="w-full aspect-square object-contain rounded-lg border border-[#E8E2DC] dark:border-white/5 bg-gray-100" />
                {r.productId && (
                  <Link href={`/admin/products/${r.productId}/edit`}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Edit className="w-5 h-5 text-white" />
                  </Link>
                )}
              </div>
            ))}
          </div>
          <Link href="/admin"
            className="inline-flex items-center gap-1 text-sm text-[#B8A080] hover:text-[#A89070] font-medium">
            返回产品列表，开始编辑草稿
          </Link>
        </div>
      )}
    </div>
  );
}
