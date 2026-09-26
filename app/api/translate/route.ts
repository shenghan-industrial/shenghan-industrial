export const runtime = "edge";

import { NextResponse } from "next/server";
import { llmChat, llmConfigured } from "@/lib/llm";

export async function POST(request: Request) {
  if (!llmConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  try {
    const { zhName } = (await request.json()) as { zhName: string };
    if (!zhName) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const [en, es] = await Promise.all([
      llmChat(
        [
          { role: "system", content: "Translate Chinese product names to concise English (3-8 words). Output only the translation, no explanation." },
          { role: "user", content: zhName },
        ],
        { maxTokens: 30, temperature: 0.1, timeoutMs: 8000 }
      ),
      llmChat(
        [
          { role: "system", content: "Translate Chinese product names to concise Spanish (3-8 words). Output only the translation, no explanation." },
          { role: "user", content: zhName },
        ],
        { maxTokens: 30, temperature: 0.1, timeoutMs: 8000 }
      ),
    ]);

    return NextResponse.json({ en: en.trim(), es: es.trim() });
  } catch {
    return NextResponse.json({ en: "", es: "" });
  }
}
