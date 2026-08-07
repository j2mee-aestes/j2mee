"use client";

import { ContributionBoard } from "@/components/contribute/ContributionBoard";
import { ContributionForm } from "@/components/contribute/ContributionForm";
import { useTranslations } from "@/context/LocaleContext";

export default function ContributeAttractionsPage() {
  const { t } = useTranslations();
  return (
    <>
      <ContributionForm
        kind="attraction"
        title={t("contribute.attractions")}
        subtitle={t("contribute.attractionsBody")}
      />
      <div className="mx-auto w-full max-w-xl px-4 pb-12 sm:px-6">
        <ContributionBoard
          kind="attraction"
          title={t("contribute.attractionsBoard")}
        />
      </div>
    </>
  );
}
