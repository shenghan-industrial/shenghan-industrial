export const runtime = "edge";

import { NextResponse } from "next/server";

const KEY = process.env.DASHSCOPE_API_KEY;

export async function POST(request: Request) {
  if (!KEY) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  try {
    const { zhName } = (await request.json()) as { zhName: string };
    if (!zhName) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const [en, es] = await Promise.all([
      fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({
          model: "qwen-turbo",
          messages: [
            { role: "system", content: "Translate Chinese product names to concise English (3-8 words). Output only the translation, no explanation." },
            { role: "user", content: zhName },
          ],
          max_tokens: 30, temperature: 0.1,
        }),
        signal: AbortSignal.timeout(8000),
      }).then(async (r) => {
        const d = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        return d.choices?.[0]?.message?.content?.trim() || "";
      }),
      fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({
          model: "qwen-turbo",
          messages: [
            { role: "system", content: "Translate Chinese product names to concise Spanish (3-8 words). Output only the translation, no explanation." },
            { role: "user", content: zhName },
          ],
          max_tokens: 30, temperature: 0.1,
        }),
        signal: AbortSignal.timeout(8000),
      }).then(async (r) => {
        const d = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        return d.choices?.[0]?.message?.content?.trim() || "";
      }),
    ]);

    return NextResponse.json({ en, es });
  } catch {
    return NextResponse.json({ en: "", es: "" });
  }
}
