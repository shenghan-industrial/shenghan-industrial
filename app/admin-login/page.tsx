"use client";

import { useState } from "react";
import { Shield, User, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else if (res.status === 429) {
        setError("尝试次数过多，请1分钟后再试");
      } else {
        setError("账号或密码错误");
      }
    } catch {
      setError("网络错误，请重试");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E] flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white dark:bg-[#1A1816] rounded-2xl border border-[#E8E2DC] dark:border-white/10 p-8 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#B8A080]/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-[#B8A080]" />
          </div>
          <h1 className="text-xl font-bold text-[#3D3730] dark:text-[#D4C8B8] text-center mb-6">
            管理后台登录
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E7E]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="管理员账号"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#B8A080] transition-colors text-sm"
                autoFocus
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8E7E]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="管理员密码"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#B8A080] transition-colors text-sm"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#B8A080] text-white font-semibold text-sm hover:bg-[#A89070] transition-colors disabled:opacity-50"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
