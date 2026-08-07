"use client";

import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import { localizePlaceText } from "@/lib/i18n/localizePlaceText";
import {
  loadLocalFavorites,
  type LocalFavorite,
} from "@/lib/favorites/localFavorites";
import {
  ensureSeedNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  unreadNotificationCount,
  type LocalNotification,
} from "@/lib/notifications/localNotifications";
import { mockMapLocations } from "@/data/mockMapLocations";
import { Bell, Heart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Panel = "none" | "notifications" | "favorites";

function resolveFavoriteLabel(
  favorite: LocalFavorite,
  locale: string,
): string {
  const place = mockMapLocations.find((item) => item.id === favorite.sourceId);
  if (place) {
    return localizePlaceText(place.name, locale as never);
  }
  return `${favorite.placeType} · ${favorite.sourceId}`;
}

export function HeaderQuickPanels() {
  const { t, locale } = useTranslations();
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>("none");
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [favorites, setFavorites] = useState<LocalFavorite[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
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
      setFavorites(loadLocalFavorites());
    });
  }, [t]);

  useEffect(() => {
    if (panel !== "favorites") return;
    setFavorites(loadLocalFavorites());
  }, [panel]);

  const unread = useMemo(
    () => unreadNotificationCount(notifications),
    [notifications],
  );

  const close = () => setPanel("none");

  return (
    <>
      <div className="relative">
        <button
          type="button"
          aria-label={t("common.notifications")}
          aria-expanded={panel === "notifications"}
          onClick={() =>
            setPanel((value) =>
              value === "notifications" ? "none" : "notifications",
            )
          }
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/70 text-[var(--color-text-primary)] shadow-[var(--shadow-soft)] transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sky-500" />
          ) : null}
        </button>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label={t("common.favorites")}
          aria-expanded={panel === "favorites"}
          onClick={() =>
            setPanel((value) => (value === "favorites" ? "none" : "favorites"))
          }
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/70 text-[var(--color-text-primary)] shadow-[var(--shadow-soft)] transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
        >
          <Heart className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {panel !== "none" ? (
        <div
          className="fixed inset-0 z-[70]"
          role="presentation"
          onClick={close}
        >
          <div
            className="absolute right-3 top-[4.5rem] w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-[var(--shadow-float)] sm:right-6"
            role="dialog"
            aria-modal="true"
            aria-label={
              panel === "notifications"
                ? t("common.notifications")
                : t("common.favorites")
            }
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                {panel === "notifications"
                  ? t("common.notifications")
                  : t("common.favorites")}
              </h2>
              <div className="flex items-center gap-1">
                {panel === "notifications" && unread > 0 ? (
                  <TextButton
                    variant="ghost"
                    className="h-8 text-xs"
                    onClick={() => setNotifications(markAllNotificationsRead())}
                  >
                    {t("notifications.markAllRead")}
                  </TextButton>
                ) : null}
                <button
                  type="button"
                  aria-label={t("common.close")}
                  onClick={close}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {panel === "notifications" ? (
              notifications.length === 0 ? (
                <p className="px-1 py-3 text-xs text-[var(--color-text-secondary)]">
                  {t("notifications.empty")}
                </p>
              ) : (
                <ul className="max-h-72 space-y-1 overflow-y-auto">
                  {notifications.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-sky-50 ${
                          item.read ? "opacity-75" : "bg-sky-50/60"
                        }`}
                        onClick={() => {
                          setNotifications(markNotificationRead(item.id));
                          if (item.href) {
                            close();
                            router.push(item.href);
                          }
                        }}
                      >
                        <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
                          {item.body}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : null}

            {panel === "favorites" ? (
              favorites.length === 0 ? (
                <div className="px-1 py-3">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {t("auth.noFavorites")}
                  </p>
                  <Link
                    href="/map"
                    onClick={close}
                    className="mt-2 inline-flex text-xs font-semibold text-[var(--color-accent-strong)]"
                  >
                    {t("home.cta.exploreMap")} →
                  </Link>
                </div>
              ) : (
                <ul className="max-h-72 space-y-1 overflow-y-auto">
                  {favorites.map((favorite) => (
                    <li key={`${favorite.placeType}:${favorite.sourceId}`}>
                      <Link
                        href={`/map?focus=${encodeURIComponent(favorite.sourceId)}`}
                        onClick={close}
                        className="block rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--color-text-primary)] transition hover:bg-rose-50"
                      >
                        {resolveFavoriteLabel(favorite, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )
            ) : null}

            {panel === "favorites" ? (
              <Link
                href="/my"
                onClick={close}
                className="mt-2 block rounded-xl border border-[var(--color-border)] px-3 py-2 text-center text-xs font-semibold text-[var(--color-accent-strong)] transition hover:bg-[var(--color-accent-soft)]"
              >
                {t("auth.myPage")}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
