"use client";

import { useEffect, useState } from "react";
import type { Category, SubCategory } from "@/data/categories";
import { translateCategory, translateSubCategory, translateCategoryAI, translateSubCategoryAI } from "@/lib/translate-name";
import { bustCategoriesCache } from "@/lib/use-categories";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface SubForm {
  open: boolean;
  catId: string;
  edit?: SubCategory;
}

const emptySub: SubCategory = {
  id: "", name: "", nameZh: "", nameEs: "", productSubCategory: "", productCategory: "",
};

const emptyCat = { id: "", name: "", nameZh: "", nameEs: "", productCategory: "" };

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [subForm, setSubForm] = useState<SubForm>({ open: false, catId: "" });
  const [subData, setSubData] = useState<SubCategory>(emptySub);
  const [saving, setSaving] = useState(false);

  const [catFormOpen, setCatFormOpen] = useState(false);
  const [catEdit, setCatEdit] = useState<Category | null>(null);
  const [catData, setCatData] = useState({ id: "", name: "", nameZh: "", nameEs: "", productCategory: "" });

  const fetchCats = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCats(data);
    setLoading(false);
  };

  useEffect(() => { fetchCats(); }, []);

  // Auto-translate category from Chinese (keyword first, then AI)
  const onCatZhChange = async (zh: string) => {
    if (!zh.trim()) {
      setCatData((prev) => ({ ...prev, nameZh: "", name: "", nameEs: "", productCategory: "" }));
      return;
    }
    // Instant keyword-based
    const kw = translateCategory(zh.trim());
    setCatData((prev) => ({ ...prev, nameZh: zh, name: kw.name, nameEs: kw.nameEs, productCategory: kw.productCategory }));
    // AI refinement (if available)
    try {
      const ai = await translateCategoryAI(zh.trim());
      setCatData((prev) => ({ ...prev, name: ai.name, nameEs: ai.nameEs }));
    } catch { /* keep keyword result */ }
  };

  // Auto-translate subcategory from Chinese (keyword first, then AI)
  const onSubZhChange = async (zh: string, catProductCategory: string) => {
    if (!zh.trim()) {
      setSubData((prev) => ({ ...prev, nameZh: "", name: "", nameEs: "", productSubCategory: "" }));
      return;
    }
    // Instant keyword-based
    const kw = translateSubCategory(zh.trim(), catProductCategory);
    setSubData((prev) => ({ ...prev, nameZh: zh, name: kw.name, nameEs: kw.nameEs, productSubCategory: kw.productSubCategory }));
    // AI refinement (if available)
    try {
      const ai = await translateSubCategoryAI(zh.trim());
      setSubData((prev) => ({ ...prev, name: ai.name, nameEs: ai.nameEs }));
    } catch { /* keep keyword result */ }
  };

  // --- Subcategory handlers ---
  const openAdd = (cat: Category) => {
    setSubData({ ...emptySub, id: Date.now().toString(36), productCategory: cat.productCategory });
    setSubForm({ open: true, catId: cat.id });
  };

  const openEdit = (catId: string, sub: SubCategory) => {
    setSubData({ ...sub });
    setSubForm({ open: true, catId, edit: sub });
  };

  const closeForm = () => {
    setSubForm({ open: false, catId: "" });
    setSubData(emptySub);
  };

  const handleSaveSub = async () => {
    if (!subData.nameZh.trim()) { alert("请输入中文名称"); return; }
    if (!subData.name.trim()) { alert("英文名称不能为空"); return; }
    if (!subData.productSubCategory.trim()) { alert("系统ID不能为空"); return; }
    setSaving(true);

    try {
      if (subForm.edit) {
        const { id: _, productCategory: __, ...updates } = subData;
        const res = await fetch(`/api/admin/categories/${subForm.catId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subId: subForm.edit.id, ...updates }),
        });
        if (!res.ok) { const e = await res.json(); alert("更新失败: " + (e.error || res.status)); setSaving(false); return; }
      } else {
        const res = await fetch(`/api/admin/categories/${subForm.catId}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subData),
        });
        if (!res.ok) { const e = await res.json(); alert("添加失败: " + (e.error || res.status)); setSaving(false); return; }
      }
    } catch (err) {
      alert("网络错误，请重试");
      setSaving(false);
      return;
    }

    setSaving(false);
    closeForm();
    bustCategoriesCache();
    fetchCats();
  };

  const handleDeleteSub = async (catId: string, sub: SubCategory) => {
    if (!confirm(`确定删除子品类 "${sub.nameZh || sub.name}"？`)) return;
    await fetch(`/api/admin/categories/${catId}?subId=${sub.id}`, { method: "DELETE" });
    bustCategoriesCache();
    fetchCats();
  };

  // --- Category handlers ---
  const openNewCat = () => {
    setCatEdit(null);
    setCatData({ ...emptyCat, id: Date.now().toString(36) });
    setCatFormOpen(true);
  };

  const openEditCat = (cat: Category) => {
    setCatEdit(cat);
    setCatData({ id: cat.id, name: cat.name, nameZh: cat.nameZh, nameEs: cat.nameEs || "", productCategory: cat.productCategory });
    setCatFormOpen(true);
  };

  const handleSaveCat = async () => {
    if (!catData.nameZh.trim() || !catData.name.trim() || !catData.productCategory.trim()) return;
    setSaving(true);

    if (catEdit) {
      const res = await fetch(`/api/admin/categories/${catEdit.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catData),
      });
      if (!res.ok) { alert("更新失败"); setSaving(false); return; }
    } else {
      const res = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catData),
      });
      if (!res.ok) { alert("创建失败"); setSaving(false); return; }
    }

    setSaving(false);
    setCatFormOpen(false);
    bustCategoriesCache();
    fetchCats();
  };

  const handleDeleteCat = async (cat: Category) => {
    if (!confirm(`确定删除品类 "${cat.nameZh}" 及其所有子品类？`)) return;
    await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    bustCategoriesCache();
    fetchCats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const catIdMask = (cat: Category) => `品类ID: ${cat.productCategory}`;
  const subIdMask = (sub: SubCategory) => `ID: ${sub.productSubCategory}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">品类管理</h1>
          <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1">共 {cats.length} 个品类</p>
        </div>
        <button onClick={openNewCat}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors">
          <Plus className="w-4 h-4" />新增品类
        </button>
      </div>

      <div className="space-y-4">
        {cats.map((cat) => {
          const items = cat.children || cat.groups?.flatMap((g) => g.children) || [];
          return (
            <div key={cat.id} className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-[#F5F2EF] dark:bg-[#12100E] border-b border-[#E8E2DC] dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#3D3730] dark:text-[#D4C8B8]">{cat.nameZh}</span>
                    <span className="text-xs text-[#9B8E7E] dark:text-white/30">{cat.name} / {cat.nameEs}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditCat(cat)}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 text-[#6B6058] dark:text-white/40 hover:text-[#B8A080] transition-colors" title="编辑品类">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => openAdd(cat)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[#B8A080] hover:bg-[#B8A080]/10 transition-colors">
                    <Plus className="w-3 h-3" />添加子品类
                  </button>
                  <button onClick={() => handleDeleteCat(cat)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-[#6B6058] dark:text-white/40 hover:text-red-500 transition-colors" title="删除品类">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-[#E8E2DC] dark:divide-white/5">
                {items.length === 0 ? (
                  <div className="px-5 py-4 text-xs text-[#9B8E7E] dark:text-white/30">暂无子品类，点击&ldquo;添加子品类&rdquo;创建</div>
                ) : (
                  items.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between px-5 py-2.5 hover:bg-[#F5F2EF]/50 dark:hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#3D3730] dark:text-white">{sub.nameZh}</span>
                        <span className="text-xs text-[#9B8E7E] dark:text-white/30">{sub.name} / {sub.nameEs || sub.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(cat.id, sub)}
                          className="p-1.5 rounded-lg hover:bg-[#F5F2EF] dark:hover:bg-white/5 text-[#6B6058] dark:text-white/40 hover:text-[#B8A080] transition-colors">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteSub(cat.id, sub)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-[#6B6058] dark:text-white/40 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subcategory Modal */}
      {subForm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeForm}>
          <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#3D3730] dark:text-[#D4C8B8]">
                {subForm.edit ? "编辑子品类" : "新增子品类"}
              </h2>
              <button onClick={closeForm} className="p-1 rounded-lg hover:bg-[#F5F2EF] dark:hover:bg-white/5 text-[#9B8E7E]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">中文名称 *</label>
                <input type="text" value={subData.nameZh} onChange={(e) => onSubZhChange(e.target.value, subData.productCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080]" placeholder="例如：沙发" />
                <p className="text-[10px] text-[#B8A080] mt-1">英文/西班牙语/标识将自动生成</p>
              </div>
              {subData.nameZh.trim() && (
                <div className="bg-[#F5F2EF] dark:bg-[#12100E] rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#9B8E7E] dark:text-white/30 w-10">英文:</span>
                    <input type="text" value={subData.name} onChange={(e) => setSubData({ ...subData, name: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#1A1816] text-[#3D3730] dark:text-white focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#9B8E7E] dark:text-white/30 w-10">西语:</span>
                    <input type="text" value={subData.nameEs || ""} onChange={(e) => setSubData({ ...subData, nameEs: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#1A1816] text-[#3D3730] dark:text-white focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#9B8E7E] dark:text-white/30 w-10">系统ID:</span>
                    <input type="text" value={subData.productSubCategory} onChange={(e) => setSubData({ ...subData, productSubCategory: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#1A1816] text-[#3D3730] dark:text-white focus:outline-none font-mono text-[11px]" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeForm} className="px-4 py-2 rounded-lg text-sm text-[#6B6058] dark:text-white/50 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors">取消</button>
              <button onClick={handleSaveSub} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors disabled:opacity-50">
                <Save className="w-3.5 h-3.5" />
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {catFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setCatFormOpen(false)}>
          <div className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#3D3730] dark:text-[#D4C8B8]">
                {catEdit ? "编辑品类" : "新增品类"}
              </h2>
              <button onClick={() => setCatFormOpen(false)} className="p-1 rounded-lg hover:bg-[#F5F2EF] dark:hover:bg-white/5 text-[#9B8E7E]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#6B6058] dark:text-white/50 mb-1">中文名称 *</label>
                <input type="text" value={catData.nameZh} onChange={(e) => onCatZhChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080]" placeholder="例如：家具类" />
                <p className="text-[10px] text-[#B8A080] mt-1">英文/西班牙语/标识将自动生成</p>
              </div>
              {catData.nameZh.trim() && (
                <div className="bg-[#F5F2EF] dark:bg-[#12100E] rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#9B8E7E] dark:text-white/30 w-10">英文:</span>
                    <input type="text" value={catData.name} onChange={(e) => setCatData({ ...catData, name: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#1A1816] text-[#3D3730] dark:text-white focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#9B8E7E] dark:text-white/30 w-10">西语:</span>
                    <input type="text" value={catData.nameEs || ""} onChange={(e) => setCatData({ ...catData, nameEs: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#1A1816] text-[#3D3730] dark:text-white focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#9B8E7E] dark:text-white/30 w-10">系统ID:</span>
                    <input type="text" value={catData.productCategory} onChange={(e) => setCatData({ ...catData, productCategory: e.target.value })}
                      className="flex-1 px-2 py-1 rounded border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#1A1816] text-[#3D3730] dark:text-white focus:outline-none font-mono text-[11px]" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setCatFormOpen(false)} className="px-4 py-2 rounded-lg text-sm text-[#6B6058] dark:text-white/50 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors">取消</button>
              <button onClick={handleSaveCat} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors disabled:opacity-50">
                <Save className="w-3.5 h-3.5" />
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
