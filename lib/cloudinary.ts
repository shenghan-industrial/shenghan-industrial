export const runtime = "edge";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "wn0jxugx";
const API_KEY = process.env.CLOUDINARY_API_KEY || "651296621716161";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "G79vVrr1eMeZLGKx96IjqotLphk";

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  original: { filename: string; url: string; mime: string; size: number };
  thumbnail: { filename: string; url: string; width: number; format: string };
  medium: { filename: string; url: string; width: number; format: string };
  large: { filename: string; url: string; width: number; format: string };
}

async function sha1(message: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(message));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function cloudinaryUrl(publicId: string, transforms: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const timestamp = Math.round(Date.now() / 1000).toString();
  const folder = "products";

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await sha1(paramsToSign);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const result = await resp.json() as Record<string, unknown>;

  if (!resp.ok) {
    const msg = (result as { error?: { message?: string } }).error?.message || "Upload failed";
    throw new Error(msg);
  }

  const publicId = result.public_id as string;
  const format = (result.format as string) || "jpg";
  const mime = `image/${format === "jpg" ? "jpeg" : format}`;
  const filename = publicId.split("/").pop()! + "." + format;
  const bytes = (result.bytes as number) || file.size;
  const originalUrl = (result.secure_url as string) || (result.url as string);

  return {
    url: originalUrl,
    secure_url: originalUrl,
    public_id: publicId,
    width: result.width as number,
    height: result.height as number,
    format,
    bytes,
    original: { filename, url: originalUrl, mime, size: bytes },
    thumbnail: {
      filename: filename.replace(/\.[^.]+$/, "-thumb.webp"),
      url: cloudinaryUrl(publicId, "c_scale,w_150,f_webp"),
      width: 150,
      format: "webp",
    },
    medium: {
      filename: filename.replace(/\.[^.]+$/, "-medium.webp"),
      url: cloudinaryUrl(publicId, "c_scale,w_600,f_webp"),
      width: 600,
      format: "webp",
    },
    large: {
      filename: filename.replace(/\.[^.]+$/, "-large.webp"),
      url: cloudinaryUrl(publicId, "c_scale,w_1200,f_webp"),
      width: 1200,
      format: "webp",
    },
  };
}
