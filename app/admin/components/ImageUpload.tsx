"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image } from "lucide-react";

interface ImageUploadProps { value: string; onChange: (url: string) => void; }

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("仅支持图片文件"); return; }
    setError(""); setUploading(true);
    const formData = new FormData(); formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        // API returns { original: {url}, thumbnail: {url}, ... } for normal uploads
        // or { url, deduplicated, ... } for dedup hits
        const imageUrl = data.original?.url || data.url;
        if (imageUrl) onChange(imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`);
        else setError("上传失败：" + (data.error || "未知错误"));
      } else { setError("上传失败，请检查服务器"); }
    } catch { setError("网络错误，请确认服务器在运行"); }
    setUploading(false);
  };

  return (
    <div>
      {value ? (
        <div className="relative inline-block group">
          <img src={value} alt="产品图片" className="w-40 h-40 rounded-xl object-contain border border-[#E8E2DC] dark:border-white/10 bg-gray-100" />
          <button onClick={() => onChange("")} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => inputRef.current?.click()} className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/60 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            更换图片
          </button>
        </div>
      ) : (
        <div>
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`w-40 h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${dragOver ? "border-[#B8A080] bg-[#B8A080]/5" : "border-[#E8E2DC] dark:border-white/10 hover:border-[#B8A080]/50 bg-[#F5F2EF] dark:bg-[#12100E]"}`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[#B8A080] animate-spin" />
                <span className="text-[10px] text-[#9B8E7E]">上传中...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#E8E2DC]/30 dark:bg-white/5 flex items-center justify-center">
                  <Image className="w-5 h-5 text-[#B8A080]" />
                </div>
                <span className="text-[11px] font-medium text-[#6B6058] dark:text-white/40">点击上传</span>
                <span className="text-[10px] text-[#9B8E7E] dark:text-white/20">或拖拽图片到此处</span>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
    </div>
  );
}
