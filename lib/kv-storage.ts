// Cloudflare KV + file-based storage (dev fallback)
// Uses require() via try/catch — Edge runtime skips it, Node.js uses it

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeFS: any = (() => { try { return require("fs"); } catch { return null; } })();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodePath: any = (() => { try { return require("path"); } catch { return null; } })();

const DATA_DIR = nodePath ? nodePath.join(process.cwd(), "data", "dynamic") : null;

function readFileJSON<T>(key: string): T | undefined {
  if (!nodeFS) return undefined;
  try {
    if (!nodeFS.existsSync(DATA_DIR)) nodeFS.mkdirSync(DATA_DIR, { recursive: true });
    const fp = nodePath.join(DATA_DIR, `${key}.json`);
    if (!nodeFS.existsSync(fp)) return undefined;
    return JSON.parse(nodeFS.readFileSync(fp, "utf-8")) as T;
  } catch { return undefined; }
}

function writeFileJSON<T>(key: string, value: T): void {
  if (!nodeFS) return;
  try {
    if (!nodeFS.existsSync(DATA_DIR)) nodeFS.mkdirSync(DATA_DIR, { recursive: true });
    nodeFS.writeFileSync(nodePath.join(DATA_DIR, `${key}.json`), JSON.stringify(value, null, 2), "utf-8");
  } catch (e: any) {
    console.error("[kv-storage] Write failed:", e?.message || e);
  }
}

function getKV(): KVNamespace | null {
  try {
    const binding = (process.env as Record<string, unknown>).KV_STORE;
    if (binding && typeof (binding as KVNamespace).get === "function") {
      return binding as KVNamespace;
    }
  } catch { /* not on Cloudflare */ }
  return null;
}

export async function kvGetJSON<T>(key: string, fallback?: T): Promise<T | undefined> {
  const kv = getKV();
  if (kv) {
    const val = await kv.get(key, "json");
    return (val ?? fallback) as T | undefined;
  }
  return readFileJSON<T>(key) ?? fallback;
}

export async function kvPutJSON<T>(key: string, value: T): Promise<void> {
  const kv = getKV();
  if (kv) {
    await kv.put(key, JSON.stringify(value));
    return;
  }
  writeFileJSON(key, value);
}

export async function kvSeedIfEmpty<T>(key: string, seed: T): Promise<void> {
  const existing = await kvGetJSON<T>(key);
  if (existing === undefined || existing === null) {
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
