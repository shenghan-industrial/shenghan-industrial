"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { catZhMap, subZhMap } from "@/lib/translate-name";

const PER_PAGE = 24;

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [sort, setSort] = useState<"newest" | "name" | "cat">("newest");
  const [refetchKey, setRefetchKey] = useState(0);
  const [page, setPage] = useState(() => parseInt(searchParams.get("page") || "0", 10));
  const [loading, setLoading] = useState(true);

  // Persist page in URL
  const setPageAndPersist = (newPage: number | ((prev: number) => number)) => {
    const next = typeof newPage === "function" ? newPage(page) : newPage;
    setPage(next);
    localStorage.setItem("admin-product-page", String(next));
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.replace(`/admin?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products", { signal: controller.signal });
        if (!res.ok) {
          console.error("API error:", res.status, await res.text());
          return;
        }
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return; // 正常取消，忽略
        console.error("fetchProducts failed:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const onFocus = () => fetchProducts();
    window.addEventListener("focus", onFocus);

    return () => {
      controller.abort();
      window.removeEventListener("focus", onFocus);
    };
  }, [refetchKey]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定删除 "${name}"？`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((p) => p.id !== id));
  };

  // Category tabs from actual data
  const catTabs = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return [...set];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (catFilter) list = list.filter((p) => p.category === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.en.toLowerCase().includes(q) || p.name.zh.includes(search) ||
        (p.model && p.model.toLowerCase().includes(q)) || p.id.includes(q)
      );
    }
    // Sort
    if (sort === "name") list = [...list].sort((a, b) => a.name.zh.localeCompare(b.name.zh, "zh"));
    else if (sort === "cat") list = [...list].sort((a, b) => a.category.localeCompare(b.category));
    // "newest" — products are already in insertion order from API
    return list;
  }, [products, search, catFilter, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">产品列表</h1>
          <p className="text-xs text-[#9B8E7E] dark:text-white/30 mt-0.5">{filtered.length} 个产品</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={(e) => { setSort(e.target.value as "name" | "newest" | "cat"); setPageAndPersist(0); }}
            className="px-2.5 py-2 rounded-lg text-xs text-[#6B6058] dark:text-white/50 bg-white dark:bg-[#1A1816] border border-[#E8E2DC] dark:border-white/10 focus:outline-none">
            <option value="newest">最新</option>
            <option value="name">名称排序</option>
            <option value="cat">品类排序</option>
          </select>
          <button onClick={() => setRefetchKey(k => k + 1)}
            className="px-3 py-2 rounded-lg text-xs text-[#6B6058] dark:text-white/40 hover:bg-white dark:hover:bg-white/5 border border-[#E8E2DC] dark:border-white/10 transition-colors">
            刷新
          </button>
          <Link href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B8A080] text-white text-sm font-semibold hover:bg-[#A89070] transition-colors">
            <Plus className="w-4 h-4" />新增产品
          </Link>
        </div>
      </div>

      {/* Search + Category tabs */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9B8E7E]" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPageAndPersist(0); }}
            placeholder="搜索名称/型号..."
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#1A1816] text-sm focus:outline-none focus:border-[#B8A080] transition-colors" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => { setCatFilter(""); setPageAndPersist(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!catFilter ? "bg-[#B8A080] text-white" : "bg-white dark:bg-[#1A1816] text-[#6B6058] dark:text-white/50 border border-[#E8E2DC] dark:border-white/10 hover:border-[#B8A080]/50"}`}>
            全部
          </button>
          {catTabs.map((cat) => (
            <button key={cat} onClick={() => { setCatFilter(catFilter === cat ? "" : cat); setPageAndPersist(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${catFilter === cat ? "bg-[#B8A080] text-white" : "bg-white dark:bg-[#1A1816] text-[#6B6058] dark:text-white/50 border border-[#E8E2DC] dark:border-white/10 hover:border-[#B8A080]/50"}`}>
              {catZhMap[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {paged.map((p) => (
          <div key={p.id}
            className="group bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/5 overflow-hidden hover:border-[#B8A080]/30 transition-all">
            {/* Image */}
            <Link href={`/admin/products/${p.id}/edit`} className="block aspect-square bg-gray-100 dark:bg-[#12100E] overflow-hidden">
              <img src={p.image} alt={p.name.zh || p.name.en}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200" />
            </Link>
            {/* Info */}
            <div className="p-2.5">
              <Link href={`/admin/products/${p.id}/edit`}
                className="text-xs font-medium text-[#3D3730] dark:text-white line-clamp-1 hover:text-[#B8A080] transition-colors">
                {p.name.zh || p.name.en}
              </Link>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#9B8E7E] dark:text-white/30">
                  {catZhMap[p.category] || p.category}{p.subCategory ? ` · ${subZhMap[p.subCategory] || p.subCategory}` : ""}
                </span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/products/${p.id}/edit`}
                    className="p-1 rounded hover:bg-[#F5F2EF] dark:hover:bg-white/5 text-[#6B6058] dark:text-white/40">
                    <Edit className="w-3 h-3" /></Link>
                  <button onClick={() => handleDelete(p.id, p.name.zh || p.name.en)}
                    className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-[#6B6058] dark:text-white/40 hover:text-red-500">
                    <Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              {p.model && <p className="text-[#B8A080] text-[10px] font-mono mt-0.5 truncate">{p.model}</p>}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-[#9B8E7E] dark:text-white/30">暂无匹配产品</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => setPageAndPersist((p: number) => Math.max(0, p - 1))} disabled={page === 0}
            className="p-1.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 disabled:opacity-20 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors">
            <ChevronLeft className="w-4 h-4 text-[#6B6058]" /></button>
          <span className="text-xs text-[#6B6058] dark:text-white/40">{page + 1} / {totalPages}</span>
          <button onClick={() => setPageAndPersist((p: number) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg border border-[#E8E2DC] dark:border-white/10 disabled:opacity-20 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors">
            <ChevronRight className="w-4 h-4 text-[#6B6058]" /></button>
        </div>
      )}
    </div>
  );
}
