import { NextResponse } from "next/server";

const API_KEY = process.env.DASHSCOPE_API_KEY || "";
const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

const SYSTEM_PROMPT = `你是盛煜实业产品文案专员。**必须仔细观察用户上传的图片**，根据图片中产品的实际外观（颜色、材质、造型、风格）生成文案。禁止使用模板话术，每款产品文案必须不同。

## 编码规则
品牌SY，品类码：家具JJ、灯具DJ、建材JC、五金WJ、家电JD
家具三大系列：揽辰LC(轻奢)、锦栖JQ(新中式)、云眠YM(简约)
家具编码：SY-JJ-系列-材质-序号（例SY-JJ-LC-PC-01），材质码：PC真皮、KC科技布、SC实木、CC储物
非家具编码：SY-品类-序号（例SY-DJ-001），从001开始

## 命名规则
产品名必须以「盛煜」开头。家具：盛煜+系列+单品名；其他：盛煜+风格/功能+产品名

## 输出格式（直接输出，无开场白）
### 产品编码：
### 产品名称：
### 产品描述：（80字内，描述图片中实际看到的材质、设计、优势）
### 产品特点：
1.（20字内）
2.（20字内）
3.（20字内）
4.（20字内）

注意：必须基于图片实际内容生成！用户说"应用到产品"时末尾附加JSON：\`\`\`json\n{ "code": "...", "name": "...", "description": "...", "features": ["...","...","...","..."] }\n\`\`\``;

export async function POST(request: Request) {
  try {
    if (!API_KEY) return NextResponse.json({ reply: "请先配置 DASHSCOPE_API_KEY 环境变量" });

    const body = (await request.json()) as {
      messages?: { role: string; content: string }[];
      imageBase64?: string;
      imageType?: string;
    };

    const lastMsg = body.messages?.[body.messages.length - 1]?.content || "请仔细观察这张产品图片，根据图片中的实际外观、材质、颜色、造型生成产品文案，并应用到产品";

    // Build content array with optional image
    const content: any[] = [];
    if (body.imageBase64) {
      const mime = body.imageType || "image/jpeg";
      // Validate base64
      const b64 = body.imageBase64.replace(/\s/g, "");
      if (b64.length < 100) {
        return NextResponse.json({ reply: "图片数据无效，请重新上传" });
      }
      if (b64.length > 5_000_000) {
        return NextResponse.json({ reply: "图片太大（超过3.5MB），请缩小后重新上传" });
      }
      content.push({
        type: "image_url",
        image_url: { url: `data:${mime};base64,${b64}` },
      });
    }
    content.push({ type: "text", text: lastMsg });

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-vl-max",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(body.messages?.slice(0, -1) || []).map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
          { role: "user", content },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ reply: `API 错误: ${err.substring(0, 300)}` });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "无响应";
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ reply: `错误: ${e.message}` });
  }
}
