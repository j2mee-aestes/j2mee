import { LOCALE_INTL_TAGS, type SupportedLocale } from "@/i18n/config";

export function formatLocaleDate(
  dateInput: string | Date,
  locale: SupportedLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date =
    typeof dateInput === "string"
      ? new Date(
          /^\d{4}-\d{2}-\d{2}$/.test(dateInput)
            ? `${dateInput}T12:00:00+09:00`
            : dateInput,
        )
      : dateInput;
  if (Number.isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }
  return new Intl.DateTimeFormat(LOCALE_INTL_TAGS[locale], {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(date);
}
