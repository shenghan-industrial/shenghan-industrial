"use client";

import { useEffect, useState } from "react";
import { Mail, Package, ChevronDown, ChevronUp, Clock, Phone, Filter, MessageSquare } from "lucide-react";

// ── Types ──────────────────────────────────────────────────
type InquiryStatus = "new_inquiry" | "contacted" | "quoted" | "won" | "closed";

interface InquiryItem {
  productId: string; name: string; quantity: number; category: string;
}

interface Inquiry {
  id: string;
  name: string; email: string; phone?: string; message?: string;
  items: InquiryItem[];
  totalItems: number;
  status: InquiryStatus;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Status config ──────────────────────────────────────────
const STATUS_CONFIG: Record<InquiryStatus, { label: string; color: string; bg: string }> = {
  new_inquiry: { label: "新询盘", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
  contacted:   { label: "已联系", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
  quoted:      { label: "已报价", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10" },
  won:         { label: "成交", color: "text-green-600", bg: "bg-green-50 dark:bg-green-500/10" },
  closed:      { label: "关闭", color: "text-gray-400", bg: "bg-gray-50 dark:bg-gray-500/10" },
};

const STATUS_OPTIONS: InquiryStatus[] = ["new_inquiry", "contacted", "quoted", "won", "closed"];

// ── Component ──────────────────────────────────────────────
export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchInquiries = () => {
    fetch("/api/inquiry")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setInquiries(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);

  // Refresh on focus (for status updates from other tabs)
  useEffect(() => {
    const handler = () => fetchInquiries();
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/inquiry", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === id ? { ...inq, status, updatedAt: new Date().toISOString() } : inq
          )
        );
      }
    } catch { /* ignore */ }
    setUpdating(null);
  };

  const filtered =
    statusFilter === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">询价管理</h1>
          <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1">
            共 {inquiries.length} 条询价{statusFilter !== "all" ? ` · ${filtered.length} 条筛选` : ""}
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#9B8E7E] mr-1" />
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-[#B8A080] text-white"
                : "bg-gray-100 dark:bg-white/5 text-[#9B8E7E] hover:bg-gray-200 dark:hover:bg-white/10"
            }`}
          >
            全部
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                statusFilter === s
                  ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} ring-1 ring-current/20`
                  : "bg-gray-100 dark:bg-white/5 text-[#9B8E7E] hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Mail className="w-12 h-12 text-[#9B8E7E]/30 mx-auto mb-3" />
          <p className="text-sm text-[#9B8E7E] dark:text-white/30">
            {statusFilter === "all" ? "暂无询价" : "该状态下无询价"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => {
            const sc = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new_inquiry;
            return (
              <div
                key={inq.id}
                className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 overflow-hidden"
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#B8A080]/10 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[#B8A080]" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-sm text-[#3D3730] dark:text-white truncate">
                        {inq.name}
                        {inq.assignedTo && (
                          <span className="ml-1.5 text-[10px] text-[#B8A080] font-normal">
                            ← {inq.assignedTo}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#9B8E7E] dark:text-white/30 truncate">
                        {inq.email}{inq.phone ? ` · ${inq.phone}` : ""}
                      </p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="px-2 py-0.5 rounded bg-[#B8A080]/10 text-[#B8A080] text-xs font-semibold">
                      {inq.totalItems} 件
                    </span>
                    <span className="shrink-0 text-[10px] text-[#9B8E7E] dark:text-white/20 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                    {expanded === inq.id ? (
                      <ChevronUp className="w-4 h-4 text-[#9B8E7E]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#9B8E7E]" />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {expanded === inq.id && (
                  <div className="px-4 pb-4 border-t border-[#E8E2DC] dark:border-white/5">
                    {/* CRM actions bar */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {/* Status change */}
                      <select
                        value={inq.status}
                        onChange={(e) => updateStatus(inq.id, e.target.value as InquiryStatus)}
                        disabled={updating === inq.id}
                        className="text-xs rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-white dark:bg-[#12100E] px-2.5 py-1.5 text-[#3D3730] dark:text-white focus:outline-none focus:border-[#B8A080] disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s].label}
                          </option>
                        ))}
                      </select>

                      {/* Contact links */}
                      <a
                        href={`mailto:${inq.email}?subject=Re: Inquiry ${inq.id}`}
                        className="inline-flex items-center gap-1 text-[10px] text-[#B8A080] hover:text-[#A89070] font-medium"
                      >
                        <Mail className="w-3 h-3" /> 回复邮件
                      </a>
                      {inq.phone && (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9+]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-green-600 hover:text-green-700 font-medium"
                        >
                          <Phone className="w-3 h-3" /> WhatsApp
                        </a>
                      )}
                      <span className="text-[10px] text-[#9B8E7E] dark:text-white/20">
                        <Clock className="w-3 h-3 inline mr-0.5" />
                        {new Date(inq.updatedAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Message */}
                    {inq.message && (
                      <div className="mt-3 p-3 rounded-lg bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#6B6058] dark:text-white/50 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-[#B8A080] shrink-0" />
                        <span>{inq.message}</span>
                      </div>
                    )}

                    {/* Products */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-[#9B8E7E] dark:text-white/30 mb-2 uppercase flex items-center gap-1">
                        <Package className="w-3 h-3" /> 询价产品
                      </p>
                      <div className="space-y-1.5">
                        {inq.items.map((item) => (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-[#3D3730] dark:text-white">
                              {item.name}
                              <span className="text-[#9B8E7E] dark:text-white/30 text-xs ml-1">× {item.quantity}</span>
                            </span>
                            <span className="text-xs text-[#9B8E7E] dark:text-white/30">{item.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
