// Cloudflare KV + file-based storage (dev fallback)
// Uses __non_webpack_require__ to access Node.js fs without breaking Edge runtime builds

type FileStore = {
  readFileJSON<T>(key: string): T | undefined;
  writeFileJSON<T>(key: string, value: T): void;
  deleteFile(key: string): void;
};

function createFileStore(): FileStore | null {
  try {
    // eslint-disable-next-line
    const nr: any = (typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : null);
    if (!nr) return null;
    const fs = nr("fs");
    const path = nr("path");
    const dataDir = path.join(process.cwd(), "data", "dynamic");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    return {
      readFileJSON<T>(key: string): T | undefined {
        try {
          const fp = path.join(dataDir, `${key}.json`);
          if (!fs.existsSync(fp)) return undefined;
          return JSON.parse(fs.readFileSync(fp, "utf-8")) as T;
        } catch { return undefined; }
      },
      writeFileJSON<T>(key: string, value: T): void {
        try {
          const fp = path.join(dataDir, `${key}.json`);
          fs.writeFileSync(fp, JSON.stringify(value, null, 2), "utf-8");
        } catch (e: any) {
          console.error("[kv-storage] Write failed:", e?.message || e);
        }
      },
      deleteFile(key: string): void {
        try {
          const fp = path.join(dataDir, `${key}.json`);
          if (fs.existsSync(fp)) fs.unlinkSync(fp);
        } catch { /* ignore */ }
      },
    };
  } catch { return null; }
}

// Lazy-initialized file store (null in Edge/browser)
let _fileStore: FileStore | null | undefined;
function getFileStore(): FileStore | null {
  if (_fileStore === undefined) _fileStore = createFileStore();
  return _fileStore;
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
  const val = getFileStore()?.readFileJSON<T>(key);
  return val !== undefined ? val : fallback;
}

export async function kvPutJSON<T>(key: string, value: T): Promise<void> {
  const kv = getKV();
  if (kv) {
    await kv.put(key, JSON.stringify(value));
    return;
  }
  getFileStore()?.writeFileJSON(key, value);
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

