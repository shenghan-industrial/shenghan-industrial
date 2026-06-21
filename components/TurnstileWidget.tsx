"use client";

import { useEffect, useRef, useState } from "react";

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
  /** Reset the widget (e.g. after form submission) */
  resetKey?: number;
}

/**
 * Cloudflare Turnstile widget.
 * Injects the Turnstile script and renders the widget.
 * Falls back silently if TURNSTILE_SITE_KEY is not configured (dev mode).
 */
export function TurnstileWidget({ onToken, onExpire, resetKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  // Load Turnstile script once
  useEffect(() => {
    if (!siteKey) return; // Dev: no Turnstile configured

    // Avoid duplicate script loads
    if (document.querySelector('script[src*="turnstile"]')) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount — it's shared
    };
  }, [siteKey]);

  // Render widget when ready
  useEffect(() => {
    if (!ready || !containerRef.current || !siteKey) return;

    // Reset previous widget
    if (widgetId.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).turnstile?.reset?.(widgetId.current);
      } catch { /* ignore */ }
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const turnstile = (window as any).turnstile;
      if (!turnstile?.render) return;

      widgetId.current = turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onToken(token),
        "expired-callback": () => onExpire?.(),
        theme: "light",
        size: "normal",
      });
    } catch { /* ignore */ }
  }, [ready, siteKey, resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!siteKey) return null; // No Turnstile configured — skip widget in dev

  return <div ref={containerRef} className="flex justify-center my-3" />;
}
