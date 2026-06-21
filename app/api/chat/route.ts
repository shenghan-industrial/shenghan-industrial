import { NextResponse } from "next/server";
import { products as productsRaw } from "@/data/products";
import { migrateProduct } from "@/data/products";
import { siteConfig } from "@/data/site-config";

const DASHSCOPE_KEY = process.env.DASHSCOPE_API_KEY;
const WHATSAPP = siteConfig.contact.phone.href;

// Build a searchable product index
interface ProductEntry {
  name: string; nameZh: string; cat: string; sub: string;
  price: string; model: string; desc: string;
}
let _index: ProductEntry[] | null = null;
function getProductIndex(): ProductEntry[] {
  if (_index) return _index;
  const products = (productsRaw as Record<string, unknown>[]).map((p) => migrateProduct(p));
  _index = products.map((p) => ({
    name: p.name.en,
    nameZh: p.name.zh,
    cat: p.category || "",
    sub: p.subCategory || "",
    price: p.price || "Contact for quote",
    model: p.model || "",
    desc: p.description.en || "",
  }));
  return _index;
}

/** Find relevant products by keyword matching */
function searchProducts(query: string, max = 8): ProductEntry[] {
  const q = query.toLowerCase();
  const idx = getProductIndex();
  const scored = idx.map((p) => {
    let score = 0;
    if (p.name.toLowerCase().includes(q)) score += 10;
    if (p.nameZh.includes(query)) score += 10;
    if (p.cat.toLowerCase().includes(q)) score += 8;
    if (p.sub.toLowerCase().includes(q)) score += 8;
    if (p.desc.toLowerCase().includes(q)) score += 3;
    // Match category keywords
    const kw: Record<string, string[]> = {
      sofa: ["sofa", "couch"], bed: ["bed"], cabinet: ["cabinet", "柜"],
      adhesive: ["adhesive", "sealant", "胶"], panel: ["panel", "board", "板"],
      fastener: ["fastener", "anchor", "screw", "bolt"],
      fan: ["fan", "风扇"], heater: ["heater", "取暖"], kitchen: ["kitchen", "kettle", "blender"],
      lamp: ["lamp", "light", "灯"], furniture: ["furniture", "家具"],
      hardware: ["hardware", "五金"], building: ["building", "建材"],
      appliance: ["appliance", "家电"], lighting: ["lighting", "灯具"],
    };
    for (const [catKey, terms] of Object.entries(kw)) {
      if (terms.some((t) => q.includes(t))) {
        if (p.cat.toLowerCase().includes(catKey) || p.sub.toLowerCase().includes(catKey)) score += 5;
      }
    }
    return { p, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((s) => s.p);
}

export async function POST(request: Request) {
  if (!DASHSCOPE_KEY) {
    return NextResponse.json({ reply: "AI chat not configured." });
  }

  try {
    const { messages } = (await request.json()) as { messages: { role: string; content: string }[] };
    const userMsg = messages.filter((m) => m.role === "user").pop()?.content || "";

    // Detect transfer to human
    if (/转人工|人工客服|human|real person|live agent|talk to someone/i.test(userMsg)) {
      return NextResponse.json({
        reply: "[TRANSFER_TO_HUMAN]",
      });
    }

    // Search relevant products
    const relevant = searchProducts(userMsg);
    const catalogSection = relevant.length > 0
      ? relevant.map((p) => `- ${p.name} / ${p.nameZh} | ${p.cat} > ${p.sub} | ${p.price} | Model: ${p.model}`).join("\n")
      : "No matching products found in catalog.";

    const dashMessages = [
      {
        role: "system",
        content: `你是盛煜实业(Shengyu Industrial)的B2B客服助手。根据下面的产品信息简洁回答客户问题。用客户的语言回复。列出产品时包含名称和价格。不要说"没有相关信息"——如果匹配不精准，推荐最相关的品类。`,
      },
      {
        role: "system",
        content: `匹配到的产品：\n${catalogSection}`,
      },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const res = await fetch(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DASHSCOPE_KEY}`,
        },
        body: JSON.stringify({
          model: "qwen-turbo",
          messages: dashMessages,
          max_tokens: 400,
          temperature: 0.2,
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const reply = data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process that. Would you like to speak with our team via WhatsApp?";

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("[chat] Error:", e);
    return NextResponse.json({
      reply: "I'm having trouble connecting. Please contact us via WhatsApp.",
    });
  }
}

export async function GET() {
  return NextResponse.json({ configured: !!DASHSCOPE_KEY, whatsappUrl: WHATSAPP });
}
