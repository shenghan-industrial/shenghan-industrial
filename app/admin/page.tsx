"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定删除 "${name}"？`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((p) => p.id !== id));
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.nameZh && p.nameZh.includes(search)) ||
      p.id.includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">产品列表</h1>
          <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1">
            共 {products.length} 个产品
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增产品
        </Link>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E7E]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索产品名称、品类..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#1A1816] text-sm text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#B8A080] transition-colors"
        />
      </div>

      <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E]">
                <th className="text-left px-4 py-3 font-semibold text-[#3D3730] dark:text-[#D4C8B8] text-xs">图片</th>
                <th className="text-left px-4 py-3 font-semibold text-[#3D3730] dark:text-[#D4C8B8] text-xs">名称</th>
                <th className="text-left px-4 py-3 font-semibold text-[#3D3730] dark:text-[#D4C8B8] text-xs">品类</th>
                <th className="text-left px-4 py-3 font-semibold text-[#3D3730] dark:text-[#D4C8B8] text-xs">价格</th>
                <th className="text-left px-4 py-3 font-semibold text-[#3D3730] dark:text-[#D4C8B8] text-xs">标签</th>
                <th className="text-right px-4 py-3 font-semibold text-[#3D3730] dark:text-[#D4C8B8] text-xs">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-[#E8E2DC] dark:border-white/5 hover:bg-[#F5F2EF]/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-contain bg-gray-100 dark:bg-brand-800" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#3D3730] dark:text-white text-xs leading-tight line-clamp-1">{p.name}</p>
                    <p className="text-[#9B8E7E] dark:text-white/30 text-[11px] line-clamp-1">{p.nameZh}</p>
                  </td>
                  <td className="px-4 py-3 text-[#6B6058] dark:text-white/50 text-xs">
                    {p.category}{p.subCategory ? ` / ${p.subCategory}` : ""}
                  </td>
                  <td className="px-4 py-3 text-[#6B6058] dark:text-white/50 text-xs">
                    {p.price || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {p.badge ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B8A080] text-white">
                        {p.badge}
                      </span>
                    ) : (
                      <span className="text-[#9B8E7E] dark:text-white/20 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-1.5 rounded-lg hover:bg-[#F5F2EF] dark:hover:bg-white/5 text-[#6B6058] dark:text-white/40 hover:text-[#B8A080] transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-[#6B6058] dark:text-white/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-8 h-8 text-[#9B8E7E]/30 mx-auto mb-2" />
            <p className="text-sm text-[#9B8E7E] dark:text-white/30">暂无产品</p>
          </div>
        )}
      </div>
    </div>
  );
}
