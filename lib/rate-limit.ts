/**
 * Simple in-memory rate limiter.
 * For production, replace with Redis-based limiter via Upstash or similar.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/**
 * Check if a request should be rate-limited.
 * @param key — unique identifier (e.g. IP address or IP:endpoint)
 * @param maxRequests — max number of requests in the window
 * @param windowMs — time window in milliseconds
 * @returns `{ allowed: boolean; remaining: number; resetAt: number }`
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract a rate-limit key from a Request object.
 * Uses X-Forwarded-For header or falls back to "unknown".
 */
export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}
