// Cloudflare KV + file-based fallback
// Uses require() for Node.js modules so Edge Runtime can skip them

function getFs(): typeof import("fs") | null {
  try { return require("fs"); } catch { return null; }
}
function getPath(): typeof import("path") | null {
  try { return require("path"); } catch { return null; }
}

function getDataDir(): string {
  const path = getPath();
  if (!path) return ".data";
  return path.join(process.cwd(), ".data");
}

function ensureDataDir() {
  const fs = getFs();
  if (!fs) return;
  const dir = getDataDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function filePath(key: string): string {
  const path = getPath();
  const dir = getDataDir();
  if (path) return path.join(dir, `${key}.json`);
  return `${dir}/${key}.json`;
}

function getKV(): KVNamespace | null {
  try {
    const binding = (process.env as Record<string, unknown>).KV_STORE;
    if (binding && typeof (binding as KVNamespace).get === "function") return binding as KVNamespace;
  } catch { /* not on Cloudflare */ }
  return null;
}

export async function kvGetJSON<T>(key: string, fallback?: T): Promise<T | undefined> {
  const kv = getKV();
  if (kv) {
    const val = await kv.get(key, "json");
    return (val ?? fallback) as T | undefined;
  }
  const fs = getFs();
  if (!fs) return fallback;
  try {
    ensureDataDir();
    const fp = filePath(key);
    if (fs.existsSync(fp)) return JSON.parse(fs.readFileSync(fp, "utf-8")) as T;
  } catch { /* ignore */ }
  return fallback;
}

export async function kvPutJSON<T>(key: string, value: T): Promise<void> {
  const kv = getKV();
  if (kv) { await kv.put(key, JSON.stringify(value)); return; }
  const fs = getFs();
  if (!fs) return;
  try { ensureDataDir(); fs.writeFileSync(filePath(key), JSON.stringify(value, null, 2), "utf-8"); }
  catch { /* ignore */ }
}

export async function kvSeedIfEmpty<T>(key: string, seed: T): Promise<void> {
  const existing = await kvGetJSON<T>(key);
  if (existing === undefined || existing === null || (Array.isArray(existing) && existing.length === 0)) {
    await kvPutJSON(key, seed);
  }
}

export function hasR2(): boolean {
  try {
    const r2 = (process.env as Record<string, unknown>).R2_STORE;
    return !!(r2 && typeof (r2 as R2Bucket).put === "function");
  } catch { return false; }
}

export function getR2(): R2Bucket | null {
  try {
    const r2 = (process.env as Record<string, unknown>).R2_STORE;
    if (r2 && typeof (r2 as R2Bucket).put === "function") return r2 as R2Bucket;
  } catch { /* not on Cloudflare */ }
  return null;
}
