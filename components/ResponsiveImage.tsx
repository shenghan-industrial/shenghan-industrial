"use client";

import type { ImgHTMLAttributes } from "react";

interface ImageVariant {
  /** URL without extension (e.g. /uploads/products/img) */
  base: string;
  /** Original extension (e.g. "jpg", "png") */
  ext: string;
}

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  /** Base image URL without extension, or full URL (extension auto-stripped) */
  src: string;
  /** Alt text (required for accessibility) */
  alt: string;
  /** Image width for aspect ratio (required for CLS prevention) */
  width?: number;
  /** Image height for aspect ratio (required for CLS prevention) */
  height?: number;
  /** Whether this is the LCP image (adds preload hint) */
  isLCP?: boolean;
  /** Override sizes attribute (default: responsive) */
  sizes?: string;
}

/**
 * Parse a URL into base + extension for building variant URLs.
 * "/uploads/products/123-abc.jpg" → { base: "/uploads/products/123-abc", ext: "jpg" }
 * "/api/images/products/123-abc.webp" → { base: "/api/images/products/123-abc", ext: "webp" }
 */
function parseVariant(src: string): ImageVariant {
  const lastDot = src.lastIndexOf(".");
  if (lastDot === -1) return { base: src, ext: "jpg" };
  return {
    base: src.slice(0, lastDot),
    ext: src.slice(lastDot + 1).toLowerCase(),
  };
}

/** Build a variant URL from base + size + format */
function variantUrl(base: string, size: string): string {
  return `${base}-${size}`;
}

/** Default responsive sizes attribute */
const DEFAULT_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/**
 * Check if the image source is from the upload pipeline (has generated variants).
 * Upload paths: /uploads/products/ (local) or /api/images/ (R2 proxy).
 * Static assets like /images/products/... don't have variants.
 */
function hasVariants(src: string): boolean {
  return src.startsWith("/uploads/") || src.startsWith("/api/images/");
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  isLCP,
  sizes = DEFAULT_SIZES,
  className,
  loading: loadingProp,
  ...imgProps
}: ResponsiveImageProps) {
  const loading = loadingProp ?? "lazy";

  // Static images: no variants exist, render plain <img> — no 404s
  if (!hasVariants(src)) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={className}
        {...imgProps}
        {...(isLCP ? { "data-lcp": "true" } : {})}
      />
    );
  }

  // Upload images: use responsive <picture> with AVIF → WebP → original
  const { base, ext } = parseVariant(src);
  const originalFormat = ext === "avif" || ext === "webp" ? ext : "jpg";

  return (
    <picture>
      <source
        srcSet={`${variantUrl(base, "thumbnail")}.avif 150w, ${variantUrl(base, "medium")}.avif 600w, ${variantUrl(base, "large")}.avif 1200w`}
        sizes={sizes}
        type="image/avif"
      />
      <source
        srcSet={`${variantUrl(base, "thumbnail")}.webp 150w, ${variantUrl(base, "medium")}.webp 600w, ${variantUrl(base, "large")}.webp 1200w`}
        sizes={sizes}
        type="image/webp"
      />
      <img
        src={src}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={className}
        {...imgProps}
        {...(isLCP ? { "data-lcp": "true" } : {})}
      />
    </picture>
  );
}
