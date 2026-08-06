"use client";

import { LocalImportPanel } from "@/components/auth/LocalImportPanel";
import { TextButton } from "@/components/common/IconButton";
import { useLocaleContext, useTranslations } from "@/context/LocaleContext";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/i18n/config";
import { apiJson } from "@/lib/auth/clientApi";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  preferredLocale: string;
};

type Favorite = {
  id: string;
  sourceId: string;
  placeType: string;
};

export default function MyPage() {
  const { t, locale } = useTranslations();
  const { setLocale } = useLocaleContext();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [me, fav, schedules, activities] = await Promise.all([
      apiJson<{ profile: Profile }>("/api/me"),
      apiJson<{ favorites: Favorite[] }>("/api/favorites"),
      apiJson<{ schedules: unknown[] }>("/api/schedules"),
      apiJson<{ activityRuns: unknown[] }>("/api/activities"),
    ]);
    if (!me.ok) {
      if (me.status === 401) {
        router.replace(`/login?callbackUrl=${encodeURIComponent("/my")}`);
      }
      setLoading(false);
      return;
    }
    setProfile(me.data.profile);
    if (fav.ok) setFavorites(fav.data.favorites);
    if (schedules.ok) setScheduleCount(schedules.data.schedules.length);
    if (activities.ok) setActivityCount(activities.data.activityRuns.length);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${encodeURIComponent("/my")}`);
      return;
    }
    if (status === "authenticated") {
      queueMicrotask(() => {
        void refresh();
      });
    }
  }, [status, router, refresh]);

  const onLocaleChange = async (next: SupportedLocale) => {
    const result = await apiJson("/api/me", {
      method: "PATCH",
      body: JSON.stringify({ locale: next }),
    });
    if (!result.ok) {
      setNotice(t("auth.saveFailed"));
      return;
    }
    setLocale(next);
    setNotice(t("auth.localeSaved"));
    void refresh();
  };

  const onExport = async () => {
    const result = await apiJson<Record<string, unknown>>("/api/export");
    if (!result.ok) {
      setNotice(t("auth.exportFailed"));
      return;
    }
    const blob = new Blob([JSON.stringify(result.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `padopado-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice(t("auth.exportDone"));
  };

  const onDeleteFavorite = async (favorite: Favorite) => {
    if (!window.confirm(t("auth.deleteFavoriteConfirm"))) return;
    const result = await apiJson(
      `/api/favorites?sourceId=${encodeURIComponent(favorite.sourceId)}&placeType=${encodeURIComponent(favorite.placeType)}`,
      { method: "DELETE" },
    );
    if (!result.ok) {
      setNotice(t("auth.deleteFailed"));
      return;
    }
    void refresh();
  };

  const onClearSchedules = async () => {
    if (!window.confirm(t("auth.clearSchedulesConfirm"))) return;
    const result = await apiJson("/api/schedules?all=1", { method: "DELETE" });
    if (!result.ok) {
      setNotice(t("auth.deleteFailed"));
      return;
    }
    void refresh();
  };

  const onClearActivities = async () => {
    if (!window.confirm(t("auth.clearActivitiesConfirm"))) return;
    const result = await apiJson("/api/activities?all=1", { method: "DELETE" });
    if (!result.ok) {
      setNotice(t("auth.deleteFailed"));
      return;
    }
    void refresh();
  };

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-8 text-sm text-[var(--color-text-secondary)]">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 sm:px-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{t("auth.myPageTitle")}</h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {t("auth.myPageSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
          >
            {t("common.map")}
          </Link>
          <TextButton
            variant="ghost"
            onClick={() => void signOut({ callbackUrl: "/" })}
          >
            {t("auth.logout")}
          </TextButton>
        </div>
      </div>

      {notice ? (
        <p
          className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          role="status"
        >
          {notice}
        </p>
      ) : null}

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
        <h2 className="text-sm font-bold">{t("auth.profile")}</h2>
        <p className="mt-2 text-sm">
          {profile?.name ?? session?.user?.name ?? t("common.unknown")}
        </p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {profile?.email ?? session?.user?.email}
        </p>
        <label className="mt-3 block text-xs font-medium">
          {t("auth.preferredLocale")}
        </label>
        <select
          className="mt-1 h-10 w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
          value={(profile?.preferredLocale as SupportedLocale) ?? locale}
          onChange={(event) =>
            void onLocaleChange(event.target.value as SupportedLocale)
          }
        >
          {SUPPORTED_LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </section>

      <LocalImportPanel onImported={() => void refresh()} />

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold">{t("common.favorites")}</h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {favorites.length}
          </span>
        </div>
        {favorites.length === 0 ? (
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            {t("auth.noFavorites")}
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {favorites.map((favorite) => (
              <li
                key={favorite.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span>
                  {favorite.placeType} · {favorite.sourceId}
                </span>
                <TextButton
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={() => void onDeleteFavorite(favorite)}
                >
                  {t("common.delete")}
                </TextButton>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
        <h2 className="text-sm font-bold">{t("auth.savedData")}</h2>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {t("auth.scheduleCount", { count: scheduleCount })} ·{" "}
          {t("auth.activityCount", { count: activityCount })}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/schedules"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
          >
            {t("common.savedSchedules")}
          </Link>
          <Link
            href="/activities"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
          >
            {t("common.activities")}
          </Link>
          <TextButton onClick={() => void onExport()}>
            {t("auth.exportJson")}
          </TextButton>
          <TextButton variant="ghost" onClick={() => void onClearSchedules()}>
            {t("auth.clearSchedules")}
          </TextButton>
          <TextButton variant="ghost" onClick={() => void onClearActivities()}>
            {t("auth.clearActivities")}
          </TextButton>
        </div>
      </section>

      <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
        {t("auth.privacyNote")}
      </p>
    </div>
  );
}
