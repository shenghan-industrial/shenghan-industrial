// ── 统一 LLM 客户端：客服Chat / 产品翻译 / AI文案助手 共用 ──
// 想切换模型或服务商，只改 .env.local，不需要改任何代码：
//
//   LLM_API_KEY=你的key                # 填了就走新服务商
//   LLM_MODEL=claude-opus-5            # 想换模型改这一行
//   LLM_BASE_URL=https://ai.168661.xyz/v1/chat/completions
//   LLM_TIMEOUT_MS=30000
//
// 兼容策略：没填 LLM_API_KEY 时，自动回退到原 DashScope(Qwen) 配置。

export interface LLMConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
  timeoutMs: number;
}

export function getLLMConfig(): LLMConfig {
  const hasCustom = !!process.env.LLM_API_KEY;
  return {
    apiKey: process.env.LLM_API_KEY || process.env.DASHSCOPE_API_KEY || "",
    model: process.env.LLM_MODEL || (hasCustom ? "claude-opus-5" : "qwen-turbo"),
    baseUrl:
      process.env.LLM_BASE_URL ||
      (hasCustom
        ? "https://ai.168661.xyz/v1/chat/completions"
        : "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"),
    timeoutMs: Number(process.env.LLM_TIMEOUT_MS || 30000),
  };
}

interface LLMMessage {
  role: string;
  content: unknown; // string，或兼容 OpenAI 多模态格式 [{type,text,image_url}]
}

/**
 * 一次 OpenAI 兼容的 chat/completions 调用，返回助手文本。
 * 失败时抛出异常（含 HTTP 状态码与错误片段）。
 */
export async function llmChat(
  messages: LLMMessage[],
  opts: { maxTokens?: number; temperature?: number; timeoutMs?: number; model?: string } = {}
): Promise<string> {
  const cfg = getLLMConfig();
  if (!cfg.apiKey) throw new Error("AI not configured: set LLM_API_KEY");

  const { maxTokens = 1024, temperature = 0.7, timeoutMs = cfg.timeoutMs, model } = opts;

  const res = await fetch(cfg.baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: model || cfg.model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM API ${res.status}: ${err.slice(0, 300)}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: unknown } }[] };
  const content = data.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : content ? JSON.stringify(content) : "";
}

/** 是否已配置可用的 LLM key（自定义或 DashScope 回退） */
export function llmConfigured(): boolean {
  return !!getLLMConfig().apiKey;
}