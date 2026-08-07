import type { SupportedLocale } from "@/i18n/config";
import type { MessageTree } from "@/i18n/types";
import de from "../../messages/de.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import ja from "../../messages/ja.json";
import ko from "../../messages/ko.json";
import vi from "../../messages/vi.json";
import zhCN from "../../messages/zh-CN.json";

export const MESSAGES: Record<SupportedLocale, MessageTree> = {
  ko: ko as MessageTree,
  en: en as MessageTree,
  ja: ja as MessageTree,
  "zh-CN": zhCN as MessageTree,
  vi: vi as MessageTree,
  es: es as MessageTree,
  de: de as MessageTree,
  fr: fr as MessageTree,
};

export function flattenMessages(
  tree: MessageTree,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[path] = value;
    } else {
      Object.assign(result, flattenMessages(value, path));
    }
  }
  return result;
}

const FLAT_CACHE = new Map<SupportedLocale, Record<string, string>>();

export function getFlatMessages(locale: SupportedLocale): Record<string, string> {
  const cached = FLAT_CACHE.get(locale);
  if (cached) {
    return cached;
  }
  const flat = flattenMessages(MESSAGES[locale]);
  FLAT_CACHE.set(locale, flat);
  return flat;
}

export function lookupMessage(
  locale: SupportedLocale,
  key: string,
): string | undefined {
  return getFlatMessages(locale)[key];
}
