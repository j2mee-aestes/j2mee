"use client";

import { ContributionForm } from "@/components/contribute/ContributionForm";
import { useTranslations } from "@/context/LocaleContext";

export default function ContributeFishingPage() {
  const { t } = useTranslations();
  return (
    <ContributionForm
      kind="fishing"
      title={t("contribute.fishing")}
      subtitle={t("contribute.fishingBody")}
    />
  );
}
