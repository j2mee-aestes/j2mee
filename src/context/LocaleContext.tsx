"use client";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  detectBrowserLocale,
  isSupportedLocale,
  normalizeLocale,
  type SupportedLocale,
} from "@/i18n/config";
import { translate, type TranslateValues } from "@/lib/i18n/translate";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, values?: TranslateValues) => string;
  hydrated: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocale(locale: SupportedLocale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
  document.cookie = `${LOCALE_COOKIE_KEY}=${encodeURIComponent(locale)};path=/;max-age=31536000;samesite=lax`;
  document.documentElement.lang = locale === "zh-CN" ? "zh-CN" : locale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      let next = DEFAULT_LOCALE;
      try {
        const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
        if (isSupportedLocale(stored) || stored === "KR" || stored === "EN" || stored === "JP" || stored === "CN") {
          next = normalizeLocale(stored);
        } else {
          next = detectBrowserLocale();
        }
      } catch {
        next = detectBrowserLocale();
      }
      setLocaleState(next);
      persistLocale(next);
      setHydrated(true);
    });
  }, []);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const t = useCallback(
    (key: string, values?: TranslateValues) => translate(locale, key, values),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, hydrated }),
    [locale, setLocale, t, hydrated],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocaleContext(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return value;
}

export function useTranslations() {
  const { t, locale } = useLocaleContext();
  return { t, locale };
}
