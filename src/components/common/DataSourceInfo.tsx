"use client";

import { useTranslations } from "@/context/LocaleContext";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";

interface DataSourceInfoProps {
  sourceName?: string;
  lastVerifiedAt?: string;
  sourceUrl?: string;
  /** Unverified entries show a stronger field-check reminder. */
  isMock?: boolean;
  className?: string;
}

export function DataSourceInfo({
  sourceName,
  lastVerifiedAt,
  sourceUrl,
  isMock = true,
  className = "",
}: DataSourceInfoProps) {
  const { t, locale } = useTranslations();
  const localizedSource = sourceName
    ? localizePlaceText(sourceName, locale)
    : null;

  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-foam)]/80 p-3 text-xs text-[var(--color-text-secondary)] ${className}`}
    >
      <p className="font-semibold text-[var(--color-text-primary)]">
        {t("common.dataSource")}
      </p>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex font-semibold text-[var(--color-accent-strong)] underline-offset-2 hover:underline"
        >
          {localizedSource ?? t("common.viewSource")} →
        </a>
      ) : (
        <p className="mt-1">{localizedSource ?? t("common.publicReference")}</p>
      )}
      {isMock ? (
        <p className="mt-1">{t("common.fieldCheckNotice")}</p>
      ) : (
        <p className="mt-1">{t("common.verifiedInfo")}</p>
      )}
      <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
        {t("common.photoStagingNote")}
      </p>
      {lastVerifiedAt ? (
        <p className="mt-0.5">
          {t("common.lastVerifiedDate", { date: lastVerifiedAt })}
        </p>
      ) : null}
    </div>
  );
}
