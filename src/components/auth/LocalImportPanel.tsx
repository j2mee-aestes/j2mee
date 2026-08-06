"use client";

import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import { apiJson } from "@/lib/auth/clientApi";
import {
  clearLocalFavorites,
  loadLocalFavorites,
} from "@/lib/favorites/localFavorites";
import {
  loadSavedActivityRuns,
  persistSavedActivityRuns,
} from "@/lib/activity/activityRunStorage";
import {
  loadSavedSchedules,
  persistSavedSchedules,
} from "@/lib/schedule/scheduleStorage";
import { useState } from "react";

interface LocalImportPanelProps {
  onImported: () => void;
}

function readLocalCounts() {
  const schedules = loadSavedSchedules();
  const activityRuns = loadSavedActivityRuns();
  const favorites = loadLocalFavorites();
  return {
    schedules: schedules.length,
    activityRuns: activityRuns.length,
    favorites: favorites.length,
    total: schedules.length + activityRuns.length + favorites.length,
  };
}

export function LocalImportPanel({ onImported }: LocalImportPanelProps) {
  const { t } = useTranslations();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [counts, setCounts] = useState(readLocalCounts);

  if (counts.total === 0) {
    return null;
  }

  const importAll = async (clearLocal: boolean) => {
    setBusy(true);
    setMessage(null);
    const result = await apiJson<{
      importedSchedules: number;
      importedRuns: number;
      importedFavorites: number;
      skipped: number;
    }>("/api/import/local", {
      method: "POST",
      body: JSON.stringify({
        schedules: loadSavedSchedules(),
        activityRuns: loadSavedActivityRuns(),
        favorites: loadLocalFavorites(),
        clearLocalAfterImport: clearLocal,
      }),
    });
    setBusy(false);
    if (!result.ok) {
      setMessage(t("auth.importFailed"));
      return;
    }
    if (clearLocal) {
      persistSavedSchedules([]);
      persistSavedActivityRuns([]);
      clearLocalFavorites();
    }
    setCounts(readLocalCounts());
    setMessage(
      t("auth.importDone", {
        schedules: result.data.importedSchedules,
        runs: result.data.importedRuns,
        favorites: result.data.importedFavorites,
        skipped: result.data.skipped,
      }),
    );
    onImported();
  };

  return (
    <section className="rounded-[var(--radius-lg)] border border-teal-200 bg-teal-50 p-4">
      <h2 className="text-sm font-bold text-teal-900">{t("auth.importTitle")}</h2>
      <p className="mt-1 text-xs text-teal-900">
        {t("auth.importBody", {
          schedules: counts.schedules,
          runs: counts.activityRuns,
          favorites: counts.favorites,
        })}
      </p>
      {message ? (
        <p className="mt-2 text-xs text-teal-800" role="status">
          {message}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <TextButton
          disabled={busy}
          onClick={() => void importAll(false)}
        >
          {t("auth.importKeepLocal")}
        </TextButton>
        <TextButton
          variant="secondary"
          disabled={busy}
          onClick={() => void importAll(true)}
        >
          {t("auth.importAndClear")}
        </TextButton>
        <TextButton
          variant="ghost"
          disabled={busy}
          onClick={() => setMessage(t("auth.importSkipped"))}
        >
          {t("auth.importSkip")}
        </TextButton>
      </div>
    </section>
  );
}
