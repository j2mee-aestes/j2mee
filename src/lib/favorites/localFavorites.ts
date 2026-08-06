const KEY = "badahankki.favorites.v1";

export type LocalFavorite = {
  sourceId: string;
  placeType: string;
};

export function loadLocalFavorites(): LocalFavorite[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as LocalFavorite[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistLocalFavorites(favorites: LocalFavorite[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(KEY, JSON.stringify(favorites));
}

export function clearLocalFavorites() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(KEY);
}
