"use client";

import { Card } from "@/components/common/Card";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import type { CoastalEvent } from "@/types/event";
import { CalendarDays, MapPin, Waves } from "lucide-react";

interface EventDetailPanelProps {
  event: CoastalEvent;
  onDirections?: () => void;
  notice?: string | null;
}

function formatRange(start: string, end: string): string {
  if (start === end) return start;
  return `${start} ~ ${end}`;
}

function riskLabel(
  t: (key: string) => string,
  level: CoastalEvent["crowdRisk"],
): string {
  return t(`events.risk.${level}`);
}

export function EventDetailPanel({
  event,
  onDirections,
  notice,
}: EventDetailPanelProps) {
  const { t, locale } = useTranslations();

  return (
    <Card className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
        {t(`events.relation.${event.coastalRelation}`)}
      </p>
      <h2 className="mt-1 font-display text-lg font-bold text-[var(--color-text-primary)]">
        {localizePlaceText(event.name, locale)}
      </h2>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
        {formatRange(event.startDate, event.endDate)}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
        <MapPin className="h-3.5 w-3.5" aria-hidden />
        {localizePlaceText(event.address, locale)}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {localizePlaceText(event.summary, locale)}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Meta
          label={t("events.crowdRisk")}
          value={riskLabel(t, event.crowdRisk)}
        />
        <Meta
          label={t("events.wasteRisk")}
          value={riskLabel(t, event.wasteRisk)}
        />
        <Meta
          label={t("events.trafficImpact")}
          value={riskLabel(t, event.trafficImpact)}
        />
        <Meta
          label={t("events.scale")}
          value={t(`events.scaleLevel.${event.estimatedScale}`)}
        />
      </dl>

      <div className="mt-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-foam)]/70 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)]">
          <Waves className="h-3.5 w-3.5" aria-hidden />
          {t("events.coastalImpact")}
        </p>
        <ul className="mt-2 space-y-1.5 text-[11px] text-[var(--color-text-secondary)]">
          {event.coastalImpact.map((item) => (
            <li key={item}>· {localizePlaceText(item, locale)}</li>
          ))}
        </ul>
      </div>

      {event.notes && event.notes.length > 0 ? (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
          {event.notes.map((note) => (
            <p key={note}>{localizePlaceText(note, locale)}</p>
          ))}
        </div>
      ) : null}

      {(event.host || event.organizer || event.contact) && (
        <div className="mt-3 text-[11px] text-[var(--color-text-muted)]">
          {event.host ? (
            <p>
              {t("events.host")}: {localizePlaceText(event.host, locale)}
            </p>
          ) : null}
          {event.organizer ? (
            <p>
              {t("events.organizer")}:{" "}
              {localizePlaceText(event.organizer, locale)}
            </p>
          ) : null}
          {event.contact ? <p>{t("events.contact")}: {event.contact}</p> : null}
        </div>
      )}

      {onDirections ? (
        <TextButton
          variant="secondary"
          className="mt-3 w-full"
          onClick={onDirections}
        >
          {t("common.directions")}
        </TextButton>
      ) : null}

      {notice ? (
        <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">{notice}</p>
      ) : null}

      <div className="mt-3">
        <DataSourceInfo
          sourceName={t("events.sourceName")}
          sourceUrl={event.sourceUrl}
          lastVerifiedAt={event.sourceCheckedAt}
          isMock={false}
        />
      </div>
    </Card>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 px-2.5 py-2">
      <dt className="text-[10px] text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-0.5 font-semibold text-[var(--color-text-primary)]">
        {value}
      </dd>
    </div>
  );
}
