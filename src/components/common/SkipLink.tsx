"use client";

import { useTranslations } from "@/context/LocaleContext";

export function SkipLink() {
  const { t } = useTranslations();
  return (
    <a href="#main-content" className="skip-link">
      {t("a11y.skipToContent")}
    </a>
  );
}
