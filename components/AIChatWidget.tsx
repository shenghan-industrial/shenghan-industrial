"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, User, Bot, ArrowRight } from "lucide-react";
import { useT } from "@/lib/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatWidget() {
  const { locale } = useT();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => {
        setConfigured(d.configured);
        setWhatsappUrl(d.whatsappUrl || "");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0 && configured) {
      setMessages([
        {
          role: "assistant",
          content:
            locale === "zh"
              ? `你好！我是盛煜实业的AI客服助手 👋
我可以帮你查询产品信息、价格、起订量等。
直接提问即可！
如需人工服务，随时输入 转人工`
              : locale === "es"
                ? "¡Hola! Soy el asistente AI de Shengyu Industrial 👋\n\nPuedo ayudarte con información de productos, precios, MOQ. ¡Pregúntame!\n\nEscribe 'humano' para hablar con una persona real."
                : "Hi! I'm Shengyu Industrial's AI assistant 👋\n\nI can help with product info, pricing, MOQ, and more. Just ask!\n\nType 'human' anytime to speak with a real person.",
        },
      ]);
    }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as { reply: string };
      const reply = data.reply || "Sorry, something went wrong.";

      if (reply.includes("[TRANSFER_TO_HUMAN]")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              locale === "zh"
                ? "正在为您转接人工客服... 请点击下方按钮通过 WhatsApp 联系我们 👇"
                : locale === "es"
                  ? "Transfiriendo a un agente humano... Haga clic abajo para contactarnos por WhatsApp 👇"
                  : "Transferring you to a human agent... Click below to contact us via WhatsApp 👇",
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: locale === "zh"
            ? "抱歉，连接出现问题。请通过 WhatsApp 联系我们。"
            : locale === "es"
              ? "Error de conexión. Contáctenos por WhatsApp."
              : "Connection error. Please contact us via WhatsApp.",
        },
      ]);
    }
    setLoading(false);
  };

  const handleTransfer = () => {
    if (whatsappUrl) window.open(whatsappUrl, "_blank");
  };

  if (!configured) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-[#C8A14C] text-white shadow-lg hover:bg-[#B8943A] transition-all flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 md:bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-[380px] h-[480px] bg-white dark:bg-[#1A1816] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#C8A14C] px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {locale === "zh" ? "AI 客服助手" : locale === "es" ? "Asistente AI" : "AI Assistant"}
                </p>
                <p className="text-white/60 text-[10px]">
                  {locale === "zh" ? "输入\"转人工\"联系真人" : locale === "es" ? "Escribe \"humano\"" : "Type \"human\" for live agent"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${m.role === "user" ? "bg-[#C8A14C]/10" : "bg-gray-100 dark:bg-white/5"}`}>
                      {m.role === "user" ? <User className="w-3 h-3 text-[#C8A14C]" /> : <Bot className="w-3 h-3 text-[#C8A14C]" />}
                    </div>
                    <div className={`text-xs leading-relaxed px-3 py-2 rounded-xl whitespace-pre-wrap ${m.role === "user" ? "bg-[#C8A14C] text-white rounded-tr-sm" : "bg-gray-100 dark:bg-white/5 text-[#3D3730] dark:text-white/80 rounded-tl-sm"}`}>
                      {m.content}
                      {m.content.includes("WhatsApp") && (
                        <button onClick={handleTransfer} className="mt-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-colors">
                          WhatsApp <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5">
                    <Loader2 className="w-3 h-3 animate-spin text-[#C8A14C]" />
                    <span className="text-[10px] text-[#9B8E7E]">
                      {locale === "zh" ? "思考中..." : locale === "es" ? "Pensando..." : "Thinking..."}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-white/10 px-3 py-2 flex items-center gap-2 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={
                  locale === "zh" ? `输入问题... (输入 转人工 联系客服)` :
                  locale === "es" ? "Escribe tu pregunta..." :
                  "Ask me about products..."
                }
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12100E] text-sm text-[#3D3730] dark:text-white placeholder:text-[#9B8E7E] focus:outline-none focus:border-[#C8A14C] transition-colors"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-[#C8A14C] text-white flex items-center justify-center hover:bg-[#B8943A] transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
