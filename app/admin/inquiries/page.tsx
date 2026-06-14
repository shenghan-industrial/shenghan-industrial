"use client";

import { useEffect, useState } from "react";
import { Mail, Package, ChevronDown, ChevronUp, Clock, Phone } from "lucide-react";

interface InquiryItem { productId: string; name: string; quantity: number; category: string; }
interface Inquiry { id: string; name: string; email: string; phone?: string; message: string; items: InquiryItem[]; totalItems: number; createdAt: string; }

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/inquiry")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setInquiries(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#B8A080] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3730] dark:text-[#D4C8B8]">询价管理</h1>
          <p className="text-sm text-[#9B8E7E] dark:text-white/30 mt-1">共 {inquiries.length} 条询价</p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-20">
          <Mail className="w-12 h-12 text-[#9B8E7E]/30 mx-auto mb-3" />
          <p className="text-sm text-[#9B8E7E] dark:text-white/30">暂无询价</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 overflow-hidden">
              <button onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#F5F2EF] dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#B8A080]/10 flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-[#B8A080]" /></div>
                  <div className="text-left min-w-0">
                    <p className="font-semibold text-sm text-[#3D3730] dark:text-white truncate">{inq.name}</p>
                    <p className="text-xs text-[#9B8E7E] dark:text-white/30 truncate">{inq.email}{inq.phone ? ` · ${inq.phone}` : ""}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[#9B8E7E] dark:text-white/20 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(inq.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2 py-0.5 rounded bg-[#B8A080]/10 text-[#B8A080] text-xs font-semibold">{inq.totalItems} 件</span>
                  {expanded === inq.id ? <ChevronUp className="w-4 h-4 text-[#9B8E7E]" /> : <ChevronDown className="w-4 h-4 text-[#9B8E7E]" />}
                </div>
              </button>

              {expanded === inq.id && (
                <div className="px-4 pb-4 border-t border-[#E8E2DC] dark:border-white/5">
                  {inq.message && (
                    <div className="mt-4 p-3 rounded-lg bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#6B6058] dark:text-white/50">{inq.message}</div>
                  )}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[#9B8E7E] dark:text-white/30 mb-2 uppercase flex items-center gap-1"><Package className="w-3 h-3" /> 询价产品</p>
                    <div className="space-y-1.5">
                      {inq.items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-[#3D3730] dark:text-white">{item.name}<span className="text-[#9B8E7E] dark:text-white/30 text-xs ml-1">× {item.quantity}</span></span>
                          <span className="text-xs text-[#9B8E7E] dark:text-white/30">{item.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E8E2DC] dark:border-white/5 flex flex-wrap gap-3">
                    <a href={`mailto:${inq.email}?subject=Re: Inquiry ${inq.id}`} className="inline-flex items-center gap-2 text-xs text-[#B8A080] hover:text-[#A89070] font-medium"><Mail className="w-3.5 h-3.5" /> 回复 {inq.email}</a>
                    {inq.phone && (
                      <a href={`https://wa.me/${inq.phone.replace(/[^0-9+]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-green-600 hover:text-green-700 font-medium"><Phone className="w-3.5 h-3.5" /> WhatsApp: {inq.phone}</a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
