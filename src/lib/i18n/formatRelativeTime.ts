import { LOCALE_INTL_TAGS, type SupportedLocale } from "@/i18n/config";

export function formatLocaleRelativeTime(
  from: Date | string,
  locale: SupportedLocale,
  to: Date = new Date(),
): string {
  const date = typeof from === "string" ? new Date(from) : from;
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const diffSeconds = Math.round((date.getTime() - to.getTime()) / 1000);
  const abs = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat(LOCALE_INTL_TAGS[locale], {
    numeric: "auto",
  });
  if (abs < 60) {
    return rtf.format(diffSeconds, "second");
  }
  if (abs < 3600) {
    return rtf.format(Math.round(diffSeconds / 60), "minute");
  }
  if (abs < 86400) {
    return rtf.format(Math.round(diffSeconds / 3600), "hour");
  }
  return rtf.format(Math.round(diffSeconds / 86400), "day");
}
