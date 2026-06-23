"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // disabled - no auth
import Link from "next/link";
import { Package, Plus, LogOut, LayoutGrid, Mail, Upload } from "lucide-react";

interface AdminUser {
  username: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth disabled — set default admin
    setUser({ username: "admin", role: "SUPER_ADMIN" });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin-login";
  };

  const roleLabel =
    user.role === "SUPER_ADMIN"
      ? "超级管理员"
      : user.role === "ADMIN"
        ? "管理员"
        : "编辑";

  return (
    <div className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E]">
      <nav className="bg-white dark:bg-[#1A1816] border-b border-[#E8E2DC] dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-[#3D3730] dark:text-[#D4C8B8] font-bold"
            >
              <Package className="w-5 h-5 text-[#B8A080]" />
              <span className="text-sm">后台管理</span>
            </Link>
            <span className="text-[10px] text-[#9B8E7E] bg-[#F5F2EF] dark:bg-white/5 px-2 py-0.5 rounded-full">
              {roleLabel} · {user.username}
            </span>
            <Link
              href="/admin"
              className="text-xs font-medium text-[#6B6058] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5 inline mr-1" />
              产品列表
            </Link>
            <Link
              href="/admin/products/new"
              className="text-xs font-medium text-[#6B6058] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              新增产品
            </Link>
            <Link
              href="/admin/products/import"
              className="text-xs font-medium text-[#6B6058] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5 inline mr-1" />
              批量传图
            </Link>
            <Link
              href="/admin/site"
              className="text-xs font-medium text-[#6B6058] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5 inline mr-1" />
              站点编辑
            </Link>
            <Link
              href="/admin/categories"
              className="text-xs font-medium text-[#6B6058] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5 inline mr-1" />
              品类管理
            </Link>
            <Link
              href="/admin/inquiries"
              className="text-xs font-medium text-[#6B6058] dark:text-white/40 hover:text-[#3D3730] dark:hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              询价管理
            </Link>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-xs text-[#9B8E7E] dark:text-white/40 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            退出登录
          </button>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">{children}</div>
    </div>
  );
}
