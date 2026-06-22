import { NextResponse } from "next/server";

export const runtime = "edge";

const API_KEY = process.env.DASHSCOPE_API_KEY || "";
const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

const SYSTEM_PROMPT = `你是盛煜实业产品文案专员。**必须仔细观察用户上传的图片**，根据图片中产品的实际外观（颜色、材质、造型、风格）生成文案。禁止使用模板话术，每款产品文案必须不同。

## 编码规则
品牌SY，每个子品类有专属3字母编码，编码唯一不变，序号从001递增。

### 家具类
| 子品类 | 编码 |
|--------|------|
| Sofas 沙发 | SOF |
| Beds 床 | BED |
| Cabinets 柜子 | CAB |

家具三大系列：揽辰LC(轻奢)、锦栖JQ(新中式)、云眠YM(简约)
材质码：PC真皮、KC科技布、SC实木、CC储物
家具编码格式：SY-{编码}-{序号}，例：SY-SOF-001、SY-BED-001

### 灯具类
| 子品类 | 编码 |
|--------|------|
| Desk Lamps 台灯 | DSK |
| Pendant Lights 吊灯 | PEN |
| Floor Lamps 落地灯 | FLR |
| Portable Lights 便携灯 | PTL |
| Industrial Lights 工矿灯 | IND |
| Floodlights 投光灯 | FLD |
| Solar Lights 太阳能灯 | SOL |
| Street Lights 路灯 | STL |

灯具编码格式：SY-{编码}-{序号}，例：SY-DSK-001

### 建材类
| 子品类 | 编码 |
|--------|------|
| Adhesives 胶粘剂 | ADH |
| Panels 板材 | PNL |

### 五金类
| 子品类 | 编码 |
|--------|------|
| Fasteners 紧固件 | FAS |
| Door & Window 门窗五金 | DRW |
| Bathroom 卫浴五金 | BTH |

### 家电类
| 子品类 | 编码 |
|--------|------|
| Fans 风扇 | FAN |
| Heaters 取暖器 | HTR |
| Kitchen 厨房电器 | KIT |

### 其他类
| 编码 |
|------|
| OTH |

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
    const content: { type: string; text?: string; image_url?: { url: string } }[] = [];
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
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ reply: `错误: ${message}` });
  }
}
