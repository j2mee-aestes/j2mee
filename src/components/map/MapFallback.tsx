"use client";

import { useEffect, useState } from "react";
import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";

interface MapFallbackProps {
  variant: "missing-key" | "error";
  onRetry?: () => void;
  errorMessage?: string | null;
}

export function MapFallback({
  variant,
  onRetry,
  errorMessage,
}: MapFallbackProps) {
  const { t } = useTranslations();
  const [host, setHost] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setHost(window.location.host), 0);
    return () => window.clearTimeout(id);
  }, []);

  const title =
    variant === "missing-key"
      ? t("map.kakaoKeyMissingTitle")
      : t("map.kakaoLoadFailedTitle");
  const body =
    variant === "missing-key"
      ? t("map.kakaoKeyMissingBody")
      : t("map.kakaoLoadFailedBody");

  return (
    <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,#e0f2fe_0%,#ecfeff_45%,#f0fdf4_100%)] px-6 text-center sm:min-h-[440px]">
      <div className="max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white/95 p-5 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-[var(--color-text-primary)]">
          {title}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
          {body}
        </p>
        {variant === "error" && host ? (
          <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
            {t("map.kakaoLoadFailedDetail", {
              host,
              reason: errorMessage || "SDK_LOAD_FAILED",
            })}
          </p>
        ) : null}
        {variant === "error" ? (
          <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
            {t("map.kakaoDomainHint")}
          </p>
        ) : null}
        {variant === "error" && onRetry ? (
          <TextButton variant="primary" className="mt-4" onClick={onRetry}>
            {t("map.kakaoRetry")}
          </TextButton>
        ) : null}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  const { t } = useTranslations();
  return (
    <div
      className="relative h-full min-h-[360px] animate-pulse overflow-hidden bg-slate-100 sm:min-h-[440px]"
      aria-busy
      aria-label={t("map.mapLoading")}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#e2e8f0_0%,#f8fafc_40%,#e2e8f0_80%)]" />
      <div className="absolute left-4 top-4 h-9 w-64 rounded-full bg-white/70" />
      <div className="absolute right-4 top-4 h-28 w-11 rounded-[var(--radius-md)] bg-white/70" />
      <div className="absolute bottom-4 left-4 h-8 w-48 rounded-md bg-white/70" />
      <p className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-500">
        {t("map.mapLoading")}
      </p>
    </div>
  );
}
