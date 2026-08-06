"use client";

import { Card } from "@/components/common/Card";
import { TextButton } from "@/components/common/IconButton";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { useTranslations } from "@/context/LocaleContext";

export type WaveSnapshot = {
  waveHeightM?: number;
  wavePeriodSec?: number;
  fetchedAt?: string;
  sourceName?: string;
};

type WaveCardProps = {
  wave: WaveSnapshot | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function WaveCard({ wave, loading, error, onRetry }: WaveCardProps) {
  const { t } = useTranslations();

  if (loading) return <SkeletonCard />;

  if (error || !wave) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold">{t("wave.title")}</p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {error ?? t("wave.unavailable")}
        </p>
        <TextButton variant="secondary" className="mt-3" onClick={onRetry}>
          {t("common.retry")}
        </TextButton>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-display text-sm font-semibold tracking-tight">
        {t("wave.title")}
      </h3>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-[var(--color-foam)] px-2.5 py-2">
          <dt className="text-[10px] text-[var(--color-text-muted)]">
            {t("wave.height")}
          </dt>
          <dd className="mt-0.5 font-semibold">
            {wave.waveHeightM != null ? `${wave.waveHeightM} m` : "-"}
          </dd>
        </div>
        <div className="rounded-2xl bg-[var(--color-foam)] px-2.5 py-2">
          <dt className="text-[10px] text-[var(--color-text-muted)]">
            {t("wave.period")}
          </dt>
          <dd className="mt-0.5 font-semibold">
            {wave.wavePeriodSec != null ? `${wave.wavePeriodSec} s` : "-"}
          </dd>
        </div>
      </dl>
      <a
        href="https://www.kma.go.kr/"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex text-[11px] font-semibold text-[var(--color-accent-strong)]"
      >
        {t("wave.source")} →
      </a>
    </Card>
  );
}
