"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, Sparkles, ImagePlus, Trash2 } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

interface Props {
  context?: string;
  onApply?: (data: { code?: string; name?: string; description?: string; features?: string[] }) => void;
}

export function AIAssistant({ context, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null); // base64
  const [imageType, setImageType] = useState("image/jpeg");
  const [imageName, setImageName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) { alert("图片不能超过10MB"); return; }
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const mime = dataUrl.split(";")[0].split(":")[1] || "image/jpeg";
      const base64 = dataUrl.split(",")[1];
      if (!base64 || base64.length < 100) { alert("图片读取失败，请重试"); return; }
      setImageType(mime);
      setImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const send = async () => {
    const q = input.trim();
    if ((!q && !image) || loading) return;
    const label = q || (image ? "请根据这张产品图片生成全套上架文案，并应用到产品" : "");
    const userMsg: Message = { role: "user", content: image ? `[图片] ${label}` : label };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const userMessages = context
        ? [{ role: "user" as const, content: `【当前产品上下文】${context}` }, { role: "user" as const, content: label }]
        : [{ role: "user" as const, content: label }];

      const body: any = { messages: userMessages };
      if (image) { body.imageBase64 = image; body.imageType = imageType; }

      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "assistant", content: data.reply || data.error || "无响应" }]);
      setImage(null);
      setImageName("");
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "请求失败，请检查网络" }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const parseJSON = (content: string) => {
    const m = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch { return null; }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-[#B8A080] text-white shadow-lg hover:bg-[#A89070] transition-all flex items-center justify-center"
      >
        {open ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[420px] max-w-[calc(100vw-40px)] h-[580px] max-h-[calc(100vh-120px)] bg-white dark:bg-[#1A1816] rounded-xl border border-[#E8E2DC] dark:border-white/10 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E2DC] dark:border-white/5 bg-[#F5F2EF] dark:bg-[#12100E] rounded-t-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B8A080]" />
              <span className="text-sm font-bold text-[#3D3730] dark:text-[#D4C8B8]">AI 文案助手</span>
              <span className="text-[10px] text-[#B8A080]">豆包</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white dark:hover:bg-white/5 text-[#9B8E7E]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className={`flex-1 overflow-y-auto p-4 space-y-3 transition-colors ${dragOver ? "bg-[#B8A080]/10 border-2 border-dashed border-[#B8A080] rounded-lg" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          >
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-10 h-10 text-[#B8A080]/30 mx-auto mb-3" />
                <p className="text-xs text-[#9B8E7E] dark:text-white/30">拖拽产品图片到这里，输入品类即可生成文案</p>
                {context && (
                  <p className="text-[10px] text-[#B8A080] mt-2 px-3 py-1.5 bg-[#F5F2EF] dark:bg-[#12100E] rounded-lg mx-4">
                    已读取当前产品信息
                  </p>
                )}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-[#B8A080] text-white"
                    : "bg-[#F5F2EF] dark:bg-[#12100E] text-[#3D3730] dark:text-[#D4C8B8] border border-[#E8E2DC] dark:border-white/5"
                }`}>
                  {m.content}
                  {m.role === "assistant" && parseJSON(m.content) && onApply && (
                    <button
                      onClick={() => onApply(parseJSON(m.content)!)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B8A080] text-white text-xs font-medium hover:bg-[#A89070] transition-colors"
                    >
                      <Sparkles className="w-3 h-3" /> 应用到产品
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F5F2EF] dark:bg-[#12100E] rounded-xl px-4 py-3 border border-[#E8E2DC] dark:border-white/5">
                  <Loader2 className="w-4 h-4 text-[#B8A080] animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Image preview */}
          {image && (
            <div className="px-3 pb-1 flex items-center gap-2">
              <div className="relative">
                <img src={`data:image/webp;base64,${image}`} alt="预览" className="w-10 h-10 rounded object-cover" />
                <button onClick={() => { setImage(null); setImageName(""); }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
              <span className="text-[10px] text-[#9B8E7E] truncate flex-1">{imageName}</span>
            </div>
          )}

          <div className="p-3 border-t border-[#E8E2DC] dark:border-white/5">
            <div className="flex gap-2 items-end">
              <button
                onClick={() => fileRef.current?.click()}
                className="shrink-0 w-9 h-9 rounded-lg border border-dashed border-[#E8E2DC] dark:border-white/10 text-[#9B8E7E] hover:text-[#B8A080] hover:border-[#B8A080] flex items-center justify-center transition-colors"
                title="上传产品图片（也可拖拽图片到聊天区）"
              >
                <ImagePlus className="w-4 h-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入品类信息，或直接发送图片生成文案..."
                rows={1}
                className="flex-1 px-3 py-2 rounded-lg border border-[#E8E2DC] dark:border-white/10 bg-[#F5F2EF] dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#B8A080] resize-none"
              />
              <button
                onClick={send}
                disabled={(!input.trim() && !image) || loading}
                className="shrink-0 w-9 h-9 rounded-lg bg-[#B8A080] text-white flex items-center justify-center hover:bg-[#A89070] disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
