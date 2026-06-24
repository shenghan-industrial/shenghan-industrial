/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Image processing service — sharp-based WebP/AVIF conversion + resize.
 * Uses dynamic import + any-typed sharp calls to avoid ESM type complexity.
 */
// Use require() for Node.js modules — Edge bundler will skip if unavailable
const fs = (() => { try { return require("fs"); } catch { return null; } })() as typeof import("fs") | null;
const path = (() => { try { return require("path"); } catch { return null; } })() as typeof import("path") | null;

// ── Types ──────────────────────────────────────────────────
export interface ImageVariants {
  original: { filename: string; url: string; mime: string; size: number };
  thumbnail: { filename: string; url: string; width: number; format: "webp" };
  medium: { filename: string; url: string; width: number; format: "webp" };
  large: { filename: string; url: string; width: number; format: "webp" };
}

export interface UploadResult {
  variants: ImageVariants;
  avifVariants?: Record<string, { filename: string; url: string }>;
  hash: string;
}

// ── Constants ──────────────────────────────────────────────
export const ALLOWED_MIMES = [
  "image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml",
] as const;

export const MAX_FILE_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE || "10485760", 10);

export const SIZES = { thumbnail: 150, medium: 600, large: 1200 } as const;

// ── Validation ─────────────────────────────────────────────
export function validateImage(file: File): { valid: false; error: string } | { valid: true } {
  if (!(ALLOWED_MIMES as readonly string[]).includes(file.type)) {
    return { valid: false, error: `Invalid type: ${file.type}. Allowed: ${ALLOWED_MIMES.join(", ")}` };
  }
  if (file.size > MAX_FILE_SIZE) {
    const maxMB = (MAX_FILE_SIZE / 1048576).toFixed(1);
    return { valid: false, error: `File too large: ${(file.size / 1048576).toFixed(1)}MB. Max: ${maxMB}MB` };
  }
  return { valid: true };
}

// ── Hashing + Dedup ────────────────────────────────────────
export async function computeHash(buffer: Uint8Array): Promise<string> {
  // Web Crypto API (Edge Runtime compatible)
  const hashBuffer = await crypto.subtle.digest("SHA-256", new Uint8Array(buffer));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

const HASH_INDEX_PATH = path ? path!.join(process.cwd(), ".data", "image-hashes.json") : "";

function readHashIndex(): Record<string, string> {
  // Only available in Node.js (local dev). Returns empty on Edge/Cloudflare.
  if (!fs || !path || !HASH_INDEX_PATH) return {};
  try {
    if (fs.existsSync(HASH_INDEX_PATH)) return JSON.parse(fs.readFileSync(HASH_INDEX_PATH, "utf-8"));
  } catch (e) {
    console.error("[image-service] readHashIndex failed:", e instanceof Error ? e.message : e);
  }
  return {};
}

function writeHashIndex(index: Record<string, string>): void {
  // Only available in Node.js (local dev). No-op on Edge/Cloudflare.
  if (!fs || !path || !HASH_INDEX_PATH) return;
  try {
    const dir = path!.dirname(HASH_INDEX_PATH);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(HASH_INDEX_PATH, JSON.stringify(index, null, 2), "utf-8");
  } catch (e) {
    console.error("[image-service] writeHashIndex failed:", e instanceof Error ? e.message : e);
  }
}

export function findExistingByHash(hash: string): string | null {
  return readHashIndex()[hash] || null;
}

export function registerHash(hash: string, prefix: string): void {
  const idx = readHashIndex();
  idx[hash] = prefix;
  writeHashIndex(idx);
}

// ── Sharp wrapper (any-typed to avoid ESM CJS interop pain) ─
let _sharp: unknown = null;

async function loadSharp(): Promise<unknown> {
  if (_sharp) return _sharp;
  try {
    const mod = await import(/* webpackIgnore: true */ "sharp");
    _sharp = (mod as Record<string, unknown>).default || mod;
    return _sharp;
  } catch (e) {
    console.error("[image-service] sharp import failed, variant generation disabled:", e instanceof Error ? e.message : e);
    return null;
  }
}

// ── Main processing pipeline ───────────────────────────────
export async function processImage(
  buffer: Buffer,
  mime: string,
  filenameBase: string,
  uploadDir: string
): Promise<UploadResult> {
  const sharp = await loadSharp();
  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1] || "bin";

  // Ensure upload dir
  fs?.mkdirSync(uploadDir, { recursive: true });

  // Save original
  const originalFilename = `${filenameBase}.${ext}`;
  const originalPath = path!.join(uploadDir, originalFilename);
  console.log("[image-service] before writeFileSync, buffer.length:", buffer.length);
  console.log("[image-service] target path:", originalPath);
  fs?.writeFileSync(originalPath, buffer);
  console.log("[image-service] after writeFileSync, existsSync:", fs?.existsSync(originalPath));

  const result: UploadResult = {
    variants: {
      original: {
        filename: originalFilename,
        url: `/uploads/products/${originalFilename}`,
        mime,
        size: buffer.length,
      },
      thumbnail: { filename: "", url: "", width: 150, format: "webp" },
      medium: { filename: "", url: "", width: 600, format: "webp" },
      large: { filename: "", url: "", width: 1200, format: "webp" },
    },
    hash: await computeHash(buffer),
  };

  // Skip variant generation for SVG
  if (!sharp || mime === "image/svg+xml") return result;

  const s = sharp as (buf: Buffer) => Record<string, (...a: unknown[]) => Record<string, (...a: unknown[]) => { toBuffer(): Promise<Buffer> }>>;

  for (const [label, w] of Object.entries(SIZES)) {
    try {
      const webpBuf = await s(buffer)
        .resize(w, w, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      console.log("[image-service] webp variant", label, "buffer.length:", webpBuf.length);

      const fname = `${filenameBase}-${label}.webp`;
      const fpath = path!.join(uploadDir, fname);
      fs?.writeFileSync(fpath, webpBuf);
      console.log("[image-service] webp written, existsSync:", fs?.existsSync(fpath));

      (result.variants as unknown as Record<string, unknown>)[label] = {
        filename: fname,
        url: `/uploads/products/${fname}`,
        width: w,
        format: "webp",
      };
    } catch (e) { console.error("[image-service] webp variant failed:", e instanceof Error ? e.message : e); }

    // AVIF — may fail if libvips lacks AVIF support
    try {
      const avifBuf = await s(buffer)
        .resize(w, w, { fit: "inside", withoutEnlargement: true })
        .avif({ quality: 50 })
        .toBuffer();
      console.log("[image-service] avif variant", label, "buffer.length:", avifBuf.length);

      const avifName = `${filenameBase}-${label}.avif`;
      const apath = path!.join(uploadDir, avifName);
      fs?.writeFileSync(apath, avifBuf);
      console.log("[image-service] avif written, existsSync:", fs?.existsSync(apath));

      if (!result.avifVariants) result.avifVariants = {};
      result.avifVariants[`${label}_avif`] = {
        filename: avifName,
        url: `/uploads/products/${avifName}`,
      };
    } catch (e) { console.error("[image-service] avif variant failed:", e instanceof Error ? e.message : e); }
  }

  return result;
}

// ── R2 upload pipeline ─────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadToR2(r2: any, prefix: string, buffer: Uint8Array, mime: string): Promise<UploadResult> {
  const sharp = await loadSharp();
  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1] || "bin";
  const baseKey = `${prefix}/${Date.now()}`;

  // Upload original
  const originalKey = `${baseKey}.${ext}`;
  console.log("[image-service] R2 upload originalKey:", originalKey, "buffer.length:", buffer.length);
  await r2.put(originalKey, buffer, { httpMetadata: { contentType: mime } });
  console.log("[image-service] R2 upload complete for:", originalKey);

  const result: UploadResult = {
    variants: {
      original: {
        filename: originalKey.split("/").pop()!,
        url: `/api/images/${originalKey}`,
        mime,
        size: buffer.length,
      },
      thumbnail: { filename: "", url: "", width: 150, format: "webp" },
      medium: { filename: "", url: "", width: 600, format: "webp" },
      large: { filename: "", url: "", width: 1200, format: "webp" },
    },
    hash: await computeHash(buffer),
  };

  if (!sharp || mime === "image/svg+xml") return result;

  const s = sharp as (buf: Buffer) => Record<string, (...a: unknown[]) => Record<string, (...a: unknown[]) => { toBuffer(): Promise<Buffer> }>>;

  for (const [label, w] of Object.entries(SIZES)) {
    // WebP
    try {
      const webpBuf = await s(buffer)
        .resize(w, w, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const webpKey = `${baseKey}-${label}.webp`;
      await r2.put(webpKey, webpBuf, { httpMetadata: { contentType: "image/webp" } });

      (result.variants as unknown as Record<string, unknown>)[label] = {
        filename: webpKey.split("/").pop()!,
        url: `/api/images/${webpKey}`,
        width: w,
        format: "webp",
      };
    } catch (e) { console.error("[image-service] R2 webp variant failed:", e instanceof Error ? e.message : e); }

    // AVIF
    try {
      const avifBuf = await s(buffer)
        .resize(w, w, { fit: "inside", withoutEnlargement: true })
        .avif({ quality: 50 })
        .toBuffer();

      const avifKey = `${baseKey}-${label}.avif`;
      await r2.put(avifKey, avifBuf, { httpMetadata: { contentType: "image/avif" } });

      if (!result.avifVariants) result.avifVariants = {};
      result.avifVariants[`${label}_avif`] = {
        filename: avifKey.split("/").pop()!,
        url: `/api/images/${avifKey}`,
      };
    } catch (e) { console.error("[image-service] R2 avif variant failed:", e instanceof Error ? e.message : e); }
  }

  return result;
}

// ── Delete helpers ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteFromR2(r2: any, prefix: string): Promise<void> {
  try {
    const list = await r2.list({ prefix });
    for (const obj of list.objects) {
      await r2.delete(obj.key);
    }
    if (list.truncated) await deleteFromR2(r2, prefix);
  } catch (e) { console.error("[image-service] deleteFromR2 failed:", e instanceof Error ? e.message : e); }
}

export function deleteLocalImages(uploadDir: string, prefix: string): void {
  try {
    if (!fs?.existsSync(uploadDir)) return;
    const files = fs?.readdirSync(uploadDir);
    for (const f of files) {
      if (f.startsWith(prefix)) fs?.unlinkSync(path!.join(uploadDir, f));
    }
  } catch (e) { console.error("[image-service] deleteLocalImages failed:", e instanceof Error ? e.message : e); }
}
