// Cloudflare KV + in-memory fallback (works in both Edge and Node.js runtimes)

const memory = new Map<string, string>();

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
  const raw = memory.get(key);
  return raw !== undefined ? (JSON.parse(raw) as T) : fallback;
}

export async function kvPutJSON<T>(key: string, value: T): Promise<void> {
  const kv = getKV();
  if (kv) {
    await kv.put(key, JSON.stringify(value));
    return;
  }
  memory.set(key, JSON.stringify(value));
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
