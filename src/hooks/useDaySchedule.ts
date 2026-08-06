"use client";

import {
  DEFAULT_SCHEDULE_START_TIME,
} from "@/constants/scheduleDefaults";
import {
  applyScheduleMetrics,
  createEmptySchedule,
  createItemFromFishing,
  createItemFromPartner,
  createItemFromPlogging,
  isSamePlace,
  reindexOrders,
} from "@/lib/schedule/createScheduleItem";
import { calculateScheduleTimes } from "@/lib/schedule/calculateScheduleTimes";
import { hybridScheduleRepository } from "@/lib/schedule/hybridScheduleRepository";
import {
  clearDraftSchedule,
  loadDraftSchedule,
  persistDraftSchedule,
} from "@/lib/schedule/scheduleStorage";
import { validateSchedule } from "@/lib/schedule/validateSchedule";
import type { FishingSpot } from "@/types/fishing";
import type { PartnerPlace } from "@/types/partner";
import type { PloggingRoute } from "@/types/environment";
import type {
  DaySchedule,
  ScheduleWarning,
  TravelMode,
} from "@/types/schedule";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface UseDayScheduleResult {
  schedule: DaySchedule;
  warnings: ScheduleWarning[];
  hydrated: boolean;
  notice: string | null;
  clearNotice: () => void;
  setTitle: (title: string) => void;
  setDate: (date: string) => void;
  setTravelMode: (mode: TravelMode) => void;
  setFirstStartTime: (time: string) => void;
  addFishing: (spot: FishingSpot) => { ok: boolean; message: string };
  addPartner: (partner: PartnerPlace) => { ok: boolean; message: string };
  addPlogging: (route: PloggingRoute) => { ok: boolean; message: string };
  removeItem: (itemId: string) => void;
  moveItem: (itemId: string, direction: "up" | "down") => void;
  updateItemDuration: (itemId: string, durationMinutes: number) => void;
  updateItemStartTime: (itemId: string, startTime: string) => void;
  updateItemNotes: (itemId: string, notes: string[]) => void;
  resetSchedule: () => void;
  loadSchedule: (schedule: DaySchedule) => void;
  replaceWithRecommended: (schedule: DaySchedule) => void;
  saveToBrowser: () => Promise<{ ok: boolean; message: string }>;
  markReady: () => { ok: boolean; warnings: ScheduleWarning[] };
  isSourceInSchedule: (sourceId: string) => boolean;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

export function useDaySchedule(): UseDayScheduleResult {
  const [schedule, setSchedule] = useState<DaySchedule>(() =>
    createEmptySchedule(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) {
        return;
      }
      const draft = loadDraftSchedule();
      if (draft) {
        setSchedule(draft);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    persistDraftSchedule(schedule);
  }, [schedule, hydrated]);

  const warnings = useMemo(() => validateSchedule(schedule), [schedule]);

  const clearNotice = useCallback(() => setNotice(null), []);

  const recompute = useCallback((next: DaySchedule, firstStart?: string) => {
    const start =
      firstStart ??
      next.items.find((item) => item.order === 1)?.startTime ??
      DEFAULT_SCHEDULE_START_TIME;
    return applyScheduleMetrics(next, next.items, start);
  }, []);

  const setTitle = useCallback((title: string) => {
    setSchedule((prev) => ({
      ...prev,
      title,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const setDate = useCallback((date: string) => {
    setSchedule((prev) => ({
      ...prev,
      date,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const setTravelMode = useCallback(
    (mode: TravelMode) => {
      setSchedule((prev) =>
        recompute({
          ...prev,
          travelMode: mode,
        }),
      );
    },
    [recompute],
  );

  const setFirstStartTime = useCallback(
    (time: string) => {
      setSchedule((prev) => recompute(prev, time));
    },
    [recompute],
  );

  const addFishing = useCallback((spot: FishingSpot) => {
    let message = "";
    let ok = true;
    setSchedule((prev) => {
      if (isSamePlace(prev.items, spot.id)) {
        ok = false;
        message = "이미 일정에 추가된 장소입니다.";
        return prev;
      }
      const item = createItemFromFishing(spot, prev.items.length + 1);
      message = `${spot.name}이(가) 일정에 추가되었습니다.`;
      return recompute({ ...prev, items: [...prev.items, item] });
    });
    setNotice(message);
    return { ok, message };
  }, [recompute]);

  const addPartner = useCallback((partner: PartnerPlace) => {
    let message = "";
    let ok = true;
    setSchedule((prev) => {
      if (isSamePlace(prev.items, partner.id)) {
        ok = false;
        message = "이미 일정에 추가된 장소입니다.";
        return prev;
      }
      const item = createItemFromPartner(partner, prev.items.length + 1);
      message = `${partner.name}이(가) 일정에 추가되었습니다.`;
      return recompute({ ...prev, items: [...prev.items, item] });
    });
    setNotice(message);
    return { ok, message };
  }, [recompute]);

  const addPlogging = useCallback((route: PloggingRoute) => {
    let message = "";
    let ok = true;
    setSchedule((prev) => {
      if (isSamePlace(prev.items, route.id)) {
        ok = false;
        message = "이미 일정에 추가된 장소입니다.";
        return prev;
      }
      const item = createItemFromPlogging(route, prev.items.length + 1);
      message = `${route.name}이(가) 일정에 추가되었습니다.`;
      return recompute({ ...prev, items: [...prev.items, item] });
    });
    setNotice(message);
    return { ok, message };
  }, [recompute]);

  const removeItem = useCallback(
    (itemId: string) => {
      setSchedule((prev) => {
        const items = reindexOrders(
          prev.items.filter((item) => item.id !== itemId),
        );
        return recompute({ ...prev, items });
      });
      setSelectedItemId((current) => (current === itemId ? null : current));
    },
    [recompute],
  );

  const moveItem = useCallback(
    (itemId: string, direction: "up" | "down") => {
      setSchedule((prev) => {
        const ordered = reindexOrders(prev.items);
        const index = ordered.findIndex((item) => item.id === itemId);
        if (index < 0) {
          return prev;
        }
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= ordered.length) {
          return prev;
        }
        const next = [...ordered];
        const [removed] = next.splice(index, 1);
        next.splice(target, 0, removed);
        return recompute({ ...prev, items: reindexOrders(next) });
      });
    },
    [recompute],
  );

  const updateItemDuration = useCallback(
    (itemId: string, durationMinutes: number) => {
      setSchedule((prev) => {
        const items = prev.items.map((item) =>
          item.id === itemId
            ? { ...item, durationMinutes: Math.max(15, durationMinutes) }
            : item,
        );
        return recompute({ ...prev, items });
      });
    },
    [recompute],
  );

  const updateItemStartTime = useCallback(
    (itemId: string, startTime: string) => {
      setSchedule((prev) => {
        const ordered = reindexOrders(prev.items);
        const index = ordered.findIndex((item) => item.id === itemId);
        if (index < 0) {
          return prev;
        }
        if (index === 0) {
          return recompute(prev, startTime);
        }
        // Manual override for later items: set start then cascade after
        const updated = ordered.map((item, itemIndex) =>
          itemIndex === index ? { ...item, startTime } : item,
        );
        const before = updated.slice(0, index);
        const after = calculateScheduleTimes(updated.slice(index), {
          firstStartTime: startTime,
          travelMode: prev.travelMode,
        });
        // Fix order continuity for after items
        const merged = [...before, ...after].map((item, orderIndex) => ({
          ...item,
          order: orderIndex + 1,
        }));
        return applyScheduleMetrics(prev, merged, merged[0]?.startTime);
      });
    },
    [recompute],
  );

  const updateItemNotes = useCallback((itemId: string, notes: string[]) => {
    setSchedule((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, notes } : item,
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const resetSchedule = useCallback(() => {
    const empty = createEmptySchedule({ date: schedule.date });
    setSchedule(empty);
    clearDraftSchedule();
    setSelectedItemId(null);
    setNotice("일정이 초기화되었습니다.");
  }, [schedule.date]);

  const loadSchedule = useCallback((next: DaySchedule) => {
    setSchedule(next);
    setSelectedItemId(null);
    setNotice(`“${next.title}” 일정을 불러왔습니다.`);
  }, []);

  const replaceWithRecommended = useCallback((next: DaySchedule) => {
    setSchedule(next);
    setSelectedItemId(null);
    setNotice("추천 일정이 적용되었습니다. 시간과 순서를 수정할 수 있습니다.");
  }, []);

  const saveToBrowser = useCallback(async () => {
    const toSave: DaySchedule = {
      ...schedule,
      status: schedule.status === "ready" ? "ready" : "draft",
      updatedAt: new Date().toISOString(),
    };
    await hybridScheduleRepository.save(toSave);
    setSchedule(toSave);
    const message =
      "일정이 이 브라우저에 저장되었습니다. 로그인 또는 서버 저장 기능이 연결되지 않아 다른 기기에서는 확인할 수 없습니다.";
    setNotice(message);
    return { ok: true, message };
  }, [schedule]);

  const markReady = useCallback(() => {
    const currentWarnings = validateSchedule(schedule);
    const danger = currentWarnings.filter((item) => item.severity === "danger");
    if (danger.length > 0) {
      setNotice("위험 경고를 확인한 뒤 다시 시도해주세요.");
      return { ok: false, warnings: currentWarnings };
    }
    setSchedule((prev) => ({
      ...prev,
      status: "ready",
      updatedAt: new Date().toISOString(),
    }));
    setNotice("일정이 시작 준비 상태(ready)로 저장되었습니다.");
    return { ok: true, warnings: currentWarnings };
  }, [schedule]);

  const isSourceInSchedule = useCallback(
    (sourceId: string) => isSamePlace(schedule.items, sourceId),
    [schedule.items],
  );

  return {
    schedule,
    warnings,
    hydrated,
    notice,
    clearNotice,
    setTitle,
    setDate,
    setTravelMode,
    setFirstStartTime,
    addFishing,
    addPartner,
    addPlogging,
    removeItem,
    moveItem,
    updateItemDuration,
    updateItemStartTime,
    updateItemNotes,
    resetSchedule,
    loadSchedule,
    replaceWithRecommended,
    saveToBrowser,
    markReady,
    isSourceInSchedule,
    selectedItemId,
    setSelectedItemId,
  };
}
