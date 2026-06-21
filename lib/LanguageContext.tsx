"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type Locale = "en" | "zh" | "es";

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

// Dynamic imports for messages
async function loadMessages(locale: Locale) {
  const mod = await import(`@/messages/${locale}.json`);
  return mod.default;
}

// Get nested value from object by dot-path
function getNested(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

function getInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("locale");
      if (stored === "zh" || stored === "en" || stored === "es") return stored;
    } catch {}
    // Fallback: browser language
    const nav = navigator.language || "";
    if (nav.startsWith("zh")) return "zh";
    if (nav.startsWith("es")) return "es";
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with "en" for SSR/hydration consistency.
  // Client preference is applied in the effect below.
  const [locale, setLocaleState] = useState<Locale>("en");
  const [hydrated, setHydrated] = useState(false);
  const [messages, setMessages] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (!hydrated) {
      setHydrated(true);
      const clientLocale = getInitialLocale();
      if (clientLocale !== "en") setLocaleState(clientLocale);
    }
    loadMessages(locale).then((msgs) => {
      setMessages(msgs);
      document.documentElement.lang = locale;
    });
  }, [locale, hydrated]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNested(messages, key);
    },
    [messages]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const { t, locale, setLocale } = useContext(LanguageContext);
  return { t, locale, setLocale };
}
