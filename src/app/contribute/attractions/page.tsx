"use client";

import { ContributionForm } from "@/components/contribute/ContributionForm";
import { useTranslations } from "@/context/LocaleContext";

export default function ContributeAttractionsPage() {
  const { t } = useTranslations();
  return (
    <ContributionForm
      kind="attraction"
      title={t("contribute.attractions")}
      subtitle={t("contribute.attractionsBody")}
    />
  );
}
