"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type Locale = "en" | "zh" | "th" | "ms" | "fr" | "es";

const LOCALES: Locale[] = ["en", "zh", "th", "ms", "fr", "es"];

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
      if (stored && (LOCALES as string[]).includes(stored)) return stored as Locale;
    } catch {}
    // Fallback: browser language
    const nav = navigator.language || "";
    if (nav.startsWith("zh")) return "zh";
    if (nav.startsWith("th")) return "th";
    if (nav.startsWith("ms") || nav.startsWith("id")) return "ms";
    if (nav.startsWith("fr")) return "fr";
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
  // English messages are always loaded as a fallback: any key missing from the
  // active locale degrades to English instead of rendering a raw key name.
  const [enMsgs, setEnMsgs] = useState<Record<string, unknown>>({});

  useEffect(() => {
    loadMessages("en").then(setEnMsgs);
  }, []);

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
      const v = getNested(messages, key);
      if (v !== key) return v;
      return getNested(enMsgs, key);
    },
    [messages, enMsgs]
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
