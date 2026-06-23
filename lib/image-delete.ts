// lib/image-delete.ts
// 专门给 edge runtime 用 — 不 import sharp，不用 fs/child_process

export async function deleteFromR2(r2: R2Bucket, prefix: string): Promise<void> {
  try {
    const list = await r2.list({ prefix });
    await Promise.all(list.objects.map((obj) => r2.delete(obj.key)));
    if (list.truncated) await deleteFromR2(r2, prefix);
  } catch (e) {
    console.error("[image-delete] deleteFromR2 failed:", e instanceof Error ? e.message : e);
  }
}

export function deleteLocalImages(uploadDir: string, prefix: string): void {
  // fs 只在 Node.js 本地开发时可用，edge 上自动跳过
  const fs = (() => { try { return require("fs"); } catch { return null; } })();
  if (!fs) return;
  try {
    const files = fs.readdirSync(uploadDir) as string[];
    files.filter((f: string) => f.startsWith(prefix)).forEach((f: string) => {
      try { fs.unlinkSync(`${uploadDir}/${f}`); } catch {}
    });
  } catch (e) {
    console.error("[image-delete] deleteLocalImages failed:", e instanceof Error ? e.message : e);
  }
}
