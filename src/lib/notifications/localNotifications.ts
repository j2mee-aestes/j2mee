const KEY = "badahankki.notifications.v1";

export type LocalNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

function nowId(): string {
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function loadLocalNotifications(): LocalNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistLocalNotifications(items: LocalNotification[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 40)));
}

export function ensureSeedNotifications(
  seeds: Array<{ title: string; body: string; href?: string }>,
): LocalNotification[] {
  const existing = loadLocalNotifications();
  if (existing.length > 0) return existing;
  const seeded = seeds.map((seed, index) => ({
    id: nowId() + index,
    title: seed.title,
    body: seed.body,
    href: seed.href,
    createdAt: new Date(Date.now() - index * 3_600_000).toISOString(),
    read: false,
  }));
  persistLocalNotifications(seeded);
  return seeded;
}

export function markNotificationRead(id: string): LocalNotification[] {
  const next = loadLocalNotifications().map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
  persistLocalNotifications(next);
  return next;
}

export function markAllNotificationsRead(): LocalNotification[] {
  const next = loadLocalNotifications().map((item) => ({ ...item, read: true }));
  persistLocalNotifications(next);
  return next;
}

export function unreadNotificationCount(items?: LocalNotification[]): number {
  return (items ?? loadLocalNotifications()).filter((item) => !item.read).length;
}
