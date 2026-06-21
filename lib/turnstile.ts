/**
 * Cloudflare Turnstile server-side verification.
 * Client widget: <TurnstileWidget /> component below.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Development: allow requests without Turnstile
    if (process.env.NODE_ENV === "development") return true;
    console.error("[turnstile] TURNSTILE_SECRET_KEY not configured");
    return false;
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    return data.success === true;
  } catch (e) {
    console.error("[turnstile] Verification failed:", e);
    // Fail open in dev, fail closed in prod
    return process.env.NODE_ENV === "development";
  }
}
