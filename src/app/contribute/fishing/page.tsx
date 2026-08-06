"use client";

import { ContributionBoard } from "@/components/contribute/ContributionBoard";
import { ContributionForm } from "@/components/contribute/ContributionForm";
import { useTranslations } from "@/context/LocaleContext";

export default function ContributeFishingPage() {
  const { t } = useTranslations();
  return (
    <>
      <ContributionForm
        kind="fishing"
        title={t("contribute.fishing")}
        subtitle={t("contribute.fishingBody")}
      />
      <div className="mx-auto w-full max-w-xl px-4 pb-12 sm:px-6">
        <ContributionBoard
          kind="fishing"
          title={t("contribute.fishingBoard")}
        />
      </div>
    </>
  );
}
