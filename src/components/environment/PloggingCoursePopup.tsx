"use client";

import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import type { PloggingRoute } from "@/types/environment";

type PloggingCoursePopupProps = {
  route: PloggingRoute;
  onClose: () => void;
  onOpenDetail: () => void;
};

export function PloggingCoursePopup({
  route,
  onClose,
  onOpenDetail,
}: PloggingCoursePopupProps) {
  const { t } = useTranslations();
  const walking =
    route.walkingMinutes ?? route.estimatedMinutes;
  const crosswalks = route.crosswalkCount ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plogging-popup-title"
      onClick={onClose}
    >
      <div
        className="ui-rise glass-panel w-full max-w-md rounded-[1.75rem] p-5 shadow-[var(--shadow-float)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">
          {t("ploggingPopup.title")}
        </p>
        <h2
          id="plogging-popup-title"
          className="mt-1 font-display text-xl font-semibold tracking-tight"
        >
          {route.name}
        </h2>
        {route.description ? (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {route.description}
          </p>
        ) : null}

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl bg-[var(--color-foam)] p-3">
            <dt className="text-[var(--color-text-muted)]">
              {t("ploggingPopup.walkingTime")}
            </dt>
            <dd className="mt-1 text-base font-semibold">
              {t("ploggingPopup.minutes", { count: walking })}
            </dd>
          </div>
          <div className="rounded-2xl bg-[var(--color-foam)] p-3">
            <dt className="text-[var(--color-text-muted)]">
              {t("ploggingPopup.distance")}
            </dt>
            <dd className="mt-1 text-base font-semibold">{route.distanceKm}km</dd>
          </div>
          <div className="col-span-2 rounded-2xl bg-[var(--color-foam)] p-3">
            <dt className="text-[var(--color-text-muted)]">
              {t("ploggingPopup.crosswalks")}
            </dt>
            <dd className="mt-1 text-base font-semibold">
              {t("ploggingPopup.crosswalkCount", { count: crosswalks })}
            </dd>
          </div>
        </dl>

        {route.crossingNotes && route.crossingNotes.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-semibold">{t("ploggingPopup.crossings")}</p>
            <ul className="mt-1 space-y-1 text-xs text-[var(--color-text-secondary)]">
              {route.crossingNotes.map((note) => (
                <li key={note}>· {note}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {route.surfaceNotes && route.surfaceNotes.length > 0 ? (
          <div className="mt-3">
            <p className="text-xs font-semibold">{t("ploggingPopup.surface")}</p>
            <ul className="mt-1 space-y-1 text-xs text-[var(--color-text-secondary)]">
              {route.surfaceNotes.map((note) => (
                <li key={note}>· {note}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-5 flex gap-2">
          <TextButton variant="secondary" className="flex-1" onClick={onClose}>
            {t("ploggingPopup.close")}
          </TextButton>
          <TextButton
            variant="primary"
            className="flex-1"
            onClick={onOpenDetail}
          >
            {t("ploggingPopup.openDetail")}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
