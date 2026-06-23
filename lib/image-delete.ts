// lib/image-delete.ts
// Image delete helpers — no sharp dependency

import fs from "fs";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteFromR2(r2: any, prefix: string): Promise<void> {
  try {
    const list = await r2.list({ prefix });
    await Promise.all(list.objects.map((obj: { key: string }) => r2.delete(obj.key)));
    if (list.truncated) await deleteFromR2(r2, prefix);
  } catch (e) {
    console.error("[image-delete] deleteFromR2 failed:", e instanceof Error ? e.message : e);
  }
}

export function deleteLocalImages(uploadDir: string, prefix: string): void {
  try {
    if (!fs.existsSync(uploadDir)) return;
    for (const f of fs.readdirSync(uploadDir)) {
      if (f.startsWith(prefix)) fs.unlinkSync(path.join(uploadDir, f));
    }
  } catch (e) {
    console.error("[image-delete] deleteLocalImages failed:", e instanceof Error ? e.message : e);
  }
}
