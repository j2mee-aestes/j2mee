export type LanguageCode = "KR" | "EN" | "JP" | "CN";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "KR", label: "한국어" },
  { code: "EN", label: "English" },
  { code: "JP", label: "日本語" },
  { code: "CN", label: "中文" },
];
