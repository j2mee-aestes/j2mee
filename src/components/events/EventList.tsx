"use client";

import { Card } from "@/components/common/Card";
import { useTranslations } from "@/context/LocaleContext";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import type { CoastalEvent } from "@/types/event";
import { CalendarDays, MapPin } from "lucide-react";

interface EventListProps {
  events: CoastalEvent[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string) => void;
}

function formatRange(start: string, end: string): string {
  if (start === end) return start;
  return `${start} ~ ${end}`;
}

export function EventList({
  events,
  selectedEventId,
  onSelectEvent,
}: EventListProps) {
  const { t, locale } = useTranslations();

  return (
    <Card className="p-4">
      <div className="mb-3">
        <h2 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
          {t("events.listTitle")}
        </h2>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {t("events.listHint")}
        </p>
      </div>
      <ul className="space-y-2">
        {events.map((event) => {
          const selected = selectedEventId === event.id;
          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onSelectEvent(event.id)}
                className={`w-full rounded-2xl border px-3 py-2.5 text-left transition ${
                  selected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border)] bg-white/80 hover:border-[var(--color-accent-soft)]"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {localizePlaceText(event.name, locale)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-text-secondary)]">
                  <CalendarDays className="h-3 w-3" aria-hidden />
                  {formatRange(event.startDate, event.endDate)}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {event.venues
                    .map((venue) => localizePlaceText(venue, locale))
                    .join(" · ")}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
      {events.length === 0 ? (
        <p className="text-xs text-[var(--color-text-secondary)]">
          {t("events.empty")}
        </p>
      ) : null}
      <p className="mt-3 text-[10px] text-[var(--color-text-muted)]">
        {t("events.sourceNote")}
      </p>
    </Card>
  );
}
