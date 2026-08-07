"use client";

import { LocalImportPanel } from "@/components/auth/LocalImportPanel";
import { TextButton } from "@/components/common/IconButton";
import { useLocaleContext, useTranslations } from "@/context/LocaleContext";
import { mockMapLocations } from "@/data/mockMapLocations";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/i18n/config";
import { apiJson } from "@/lib/auth/clientApi";
import {
  loadLocalFavorites,
  persistLocalFavorites,
  type LocalFavorite,
} from "@/lib/favorites/localFavorites";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import {
  ensureSeedNotifications,
  markAllNotificationsRead,
  type LocalNotification,
} from "@/lib/notifications/localNotifications";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  preferredLocale: string;
  mileageBalance?: number;
};

type Favorite = {
  id: string;
  sourceId: string;
  placeType: string;
};

function favoriteLabel(
  favorite: { sourceId: string; placeType: string },
  locale: SupportedLocale,
): string {
  const place = mockMapLocations.find((item) => item.id === favorite.sourceId);
  if (place) return localizePlaceText(place.name, locale);
  return `${favorite.placeType} · ${favorite.sourceId}`;
}

export default function MyPage() {
  const { t, locale } = useTranslations();
  const { setLocale } = useLocaleContext();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [localFavorites, setLocalFavorites] = useState<LocalFavorite[]>([]);
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const authenticated = status === "authenticated";

  const refreshLocal = useCallback(() => {
    setLocalFavorites(loadLocalFavorites());
    setNotifications(
      ensureSeedNotifications([
        {
          title: t("notifications.seedTideTitle"),
          body: t("notifications.seedTideBody"),
          href: "/map?category=fishing",
        },
        {
          title: t("notifications.seedPloggingTitle"),
          body: t("notifications.seedPloggingBody"),
          href: "/map?category=plogging",
        },
        {
          title: t("notifications.seedFavoriteTitle"),
          body: t("notifications.seedFavoriteBody"),
          href: "/my",
        },
      ]),
    );
  }, [t]);

  const refresh = useCallback(async () => {
    const [me, fav, schedules, activities] = await Promise.all([
      apiJson<{ profile: Profile }>("/api/me"),
      apiJson<{ favorites: Favorite[] }>("/api/favorites"),
      apiJson<{ schedules: unknown[] }>("/api/schedules"),
      apiJson<{ activityRuns: unknown[] }>("/api/activities"),
    ]);
    if (!me.ok) {
      setLoading(false);
      return;
    }
    setProfile(me.data.profile);
    if (fav.ok) setFavorites(fav.data.favorites);
    if (schedules.ok) setScheduleCount(schedules.data.schedules.length);
    if (activities.ok) setActivityCount(activities.data.activityRuns.length);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      refreshLocal();
      if (status === "authenticated") {
        void refresh();
      } else if (status === "unauthenticated") {
        setLoading(false);
      }
    });
  }, [status, refresh, refreshLocal]);

  const onLocaleChange = async (next: SupportedLocale) => {
    setLocale(next);
    if (!authenticated) {
      setNotice(t("auth.localeSaved"));
      return;
    }
    const result = await apiJson("/api/me", {
      method: "PATCH",
      body: JSON.stringify({ locale: next }),
    });
    if (!result.ok) {
      setNotice(t("auth.saveFailed"));
      return;
    }
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

  const onDeleteLocalFavorite = (favorite: LocalFavorite) => {
    if (!window.confirm(t("auth.deleteFavoriteConfirm"))) return;
    const next = loadLocalFavorites().filter(
      (item) =>
        !(
          item.sourceId === favorite.sourceId &&
          item.placeType === favorite.placeType
        ),
    );
    persistLocalFavorites(next);
    setLocalFavorites(next);
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

  const shownFavorites = authenticated ? favorites : [];
  const guestFavorites = !authenticated ? localFavorites : [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 sm:px-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{t("auth.myPageTitle")}</h1>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            {authenticated
              ? t("auth.myPageSubtitle")
              : t("auth.guestMyPageSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/map"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm transition hover:border-sky-300 hover:bg-sky-50"
          >
            {t("common.map")}
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm transition hover:border-sky-300 hover:bg-sky-50"
          >
            {t("common.home")}
          </Link>
          {authenticated ? (
            <TextButton
              variant="ghost"
              onClick={() => void signOut({ callbackUrl: "/" })}
            >
              {t("auth.logout")}
            </TextButton>
          ) : (
            <Link
              href="/login?callbackUrl=%2Fmy"
              className="inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-accent-strong)] px-3 text-sm font-semibold text-white"
            >
              {t("common.login")}
            </Link>
          )}
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
        {authenticated ? (
          <>
            <p className="mt-2 text-sm">
              {profile?.name ?? session?.user?.name ?? t("common.unknown")}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {profile?.email ?? session?.user?.email}
            </p>
            <div className="mt-4 rounded-2xl bg-[var(--color-accent-soft)] px-3 py-3">
              <p className="text-xs font-semibold text-[var(--color-accent-strong)]">
                {t("auth.mileage")}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                {profile?.mileageBalance ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-[var(--color-text-secondary)]">
                {t("auth.mileageHint")}
              </p>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t("auth.guestProfileHint")}
          </p>
        )}
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

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold">{t("common.notifications")}</h2>
          <TextButton
            variant="ghost"
            className="h-8 text-xs"
            onClick={() => {
              setNotifications(markAllNotificationsRead());
              setNotice(t("notifications.markAllRead"));
            }}
          >
            {t("notifications.markAllRead")}
          </TextButton>
        </div>
        {notifications.length === 0 ? (
          <p className="text-xs text-[var(--color-text-secondary)]">
            {t("notifications.empty")}
          </p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((item) => (
              <li
                key={item.id}
                className={`rounded-xl px-3 py-2 text-xs ${
                  item.read ? "bg-[var(--color-foam)]" : "bg-sky-50"
                }`}
              >
                <p className="font-semibold">{item.title}</p>
                <p className="mt-0.5 text-[var(--color-text-secondary)]">
                  {item.body}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-1 inline-flex font-semibold text-[var(--color-accent-strong)]"
                  >
                    {t("common.next")} →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {authenticated ? <LocalImportPanel onImported={() => void refresh()} /> : null}

      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold">{t("common.favorites")}</h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {authenticated ? favorites.length : localFavorites.length}
          </span>
        </div>
        {authenticated ? (
          shownFavorites.length === 0 ? (
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              {t("auth.noFavorites")}
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {shownFavorites.map((favorite) => (
                <li
                  key={favorite.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <Link
                    href={`/map?focus=${encodeURIComponent(favorite.sourceId)}`}
                    className="font-semibold text-[var(--color-text-primary)] hover:text-sky-800"
                  >
                    {favoriteLabel(favorite, locale)}
                  </Link>
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
          )
        ) : guestFavorites.length === 0 ? (
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            {t("auth.noFavorites")}
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {guestFavorites.map((favorite) => (
              <li
                key={`${favorite.placeType}:${favorite.sourceId}`}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <Link
                  href={`/map?focus=${encodeURIComponent(favorite.sourceId)}`}
                  className="font-semibold text-[var(--color-text-primary)] hover:text-sky-800"
                >
                  {favoriteLabel(favorite, locale)}
                </Link>
                <TextButton
                  variant="ghost"
                  className="h-8 text-xs"
                  onClick={() => onDeleteLocalFavorite(favorite)}
                >
                  {t("common.delete")}
                </TextButton>
              </li>
            ))}
          </ul>
        )}
      </section>

      {authenticated ? (
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
      ) : null}

      <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
        {t("auth.privacyNote")}
      </p>
    </div>
  );
}
