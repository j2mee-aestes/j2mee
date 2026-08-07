"use client";

import { ContributionForm } from "@/components/contribute/ContributionForm";
import { useTranslations } from "@/context/LocaleContext";

export default function ContributeBinsPage() {
  const { t } = useTranslations();
  return (
    <ContributionForm
      kind="bin"
      title={t("contribute.bins")}
      subtitle={t("contribute.binsBody")}
    />
  );
}
