import type { SupportedLocale } from "@/i18n/config";

export type LocalizedText = Partial<Record<SupportedLocale, string>>;

export interface LocalizedContent {
  name: LocalizedText;
  description?: LocalizedText;
  cautionText?: Partial<Record<SupportedLocale, string[]>>;
}

export type SafetyReviewStatus =
  | "reviewed"
  | "machineTranslated"
  | "missing";

export interface LocalizedSafetyText {
  locale: SupportedLocale;
  text: string;
  reviewStatus: SafetyReviewStatus;
  reviewedAt?: string;
}

export interface FishSpecies {
  id: string;
  names: LocalizedText;
  scientificName?: string;
}

export type MessageTree = {
  [key: string]: string | MessageTree;
};
