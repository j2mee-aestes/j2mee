import { LOCALE_INTL_TAGS, type SupportedLocale } from "@/i18n/config";

export function formatLocaleTime(
  dateInput: string | Date,
  locale: SupportedLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }
  return new Intl.DateTimeFormat(LOCALE_INTL_TAGS[locale], {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...options,
  }).format(date);
}

export function formatLocaleDateTime(
  dateInput: string | Date,
  locale: SupportedLocale,
): string {
  const date =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }
  return new Intl.DateTimeFormat(LOCALE_INTL_TAGS[locale], {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
