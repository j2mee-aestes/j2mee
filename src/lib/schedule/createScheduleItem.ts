import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_SCHEDULE_START_TIME,
  DEFAULT_TRAVEL_MODE,
} from "@/constants/scheduleDefaults";
import { summarizeScheduleDistances } from "@/lib/schedule/calculateScheduleDistance";
import { calculateScheduleTimes } from "@/lib/schedule/calculateScheduleTimes";
import type {
  DaySchedule,
  ScheduleItem,
  ScheduleItemType,
} from "@/types/schedule";
import type { FishingSpot } from "@/types/fishing";
import type { PartnerPlace, PartnerType } from "@/types/partner";
import type { PloggingRoute } from "@/types/environment";

function todayKst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function createEmptySchedule(options?: {
  date?: string;
  title?: string;
}): DaySchedule {
  const now = new Date().toISOString();
  return {
    id: `schedule-${Date.now()}`,
    title: options?.title ?? "새로운 바다 일정",
    date: options?.date ?? todayKst(),
    items: [],
    totalDistanceKm: 0,
    totalDurationMinutes: 0,
    travelDistanceKm: 0,
    ploggingDistanceKm: 0,
    travelMode: DEFAULT_TRAVEL_MODE,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

export function partnerTypeToScheduleType(
  type: PartnerType,
): ScheduleItemType {
  if (type === "market" || type === "marketStore") {
    return "market";
  }
  if (type === "processingShop") {
    return "processingShop";
  }
  return "restaurant";
}

export function createItemFromFishing(
  spot: FishingSpot,
  order: number,
): ScheduleItem {
  return {
    id: `item-${spot.id}-${Date.now()}`,
    sourceId: spot.id,
    type: "fishing",
    title: spot.name,
    address: spot.address,
    coordinates: spot.coordinates,
    durationMinutes: DEFAULT_DURATION_MINUTES.fishing,
    order,
    sourceLastVerifiedAt: spot.lastVerifiedAt,
    warnings:
      spot.fishingAllowedStatus === "prohibited"
        ? ["낚시 금지 장소로 표시됨"]
        : spot.fishingAllowedStatus === "restricted"
          ? ["낚시 제한 장소"]
          : undefined,
  };
}

export function createItemFromPartner(
  partner: PartnerPlace,
  order: number,
): ScheduleItem {
  const type = partnerTypeToScheduleType(partner.type);
  const notes: string[] = [];
  if (partner.catchPolicy?.acceptanceStatus === "conditional") {
    notes.push("외부 수산물 조건부 접수");
  }
  if (partner.catchPolicy?.reservationRequired) {
    notes.push("사전 문의 권장");
  }
  if (partner.catchPolicy?.finalInspectionRequired) {
    notes.push("현장 검수 필요");
  }

  return {
    id: `item-${partner.id}-${Date.now()}`,
    sourceId: partner.id,
    type,
    title: partner.name,
    address: partner.address,
    coordinates: partner.coordinates,
    durationMinutes: DEFAULT_DURATION_MINUTES[type],
    order,
    sourceLastVerifiedAt: partner.lastVerifiedAt,
    notes: notes.length > 0 ? notes : undefined,
  };
}

export function createItemFromPlogging(
  route: PloggingRoute,
  order: number,
): ScheduleItem {
  return {
    id: `item-${route.id}-${Date.now()}`,
    sourceId: route.id,
    type: "plogging",
    title: route.name,
    address: "플로깅 코스 시작점",
    coordinates: route.startPoint,
    durationMinutes:
      route.estimatedMinutes || DEFAULT_DURATION_MINUTES.plogging,
    order,
    sourceLastVerifiedAt: route.lastVerifiedAt,
    ploggingDistanceKm: route.distanceKm,
    notes: route.cautionNotes?.slice(0, 3),
  };
}

export function reindexOrders(items: ScheduleItem[]): ScheduleItem[] {
  return [...items]
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index + 1 }));
}

export function applyScheduleMetrics(
  schedule: DaySchedule,
  items: ScheduleItem[],
  firstStartTime = items[0]?.startTime ?? DEFAULT_SCHEDULE_START_TIME,
): DaySchedule {
  const ordered = reindexOrders(items);
  const withTimes = calculateScheduleTimes(ordered, {
    firstStartTime,
    travelMode: schedule.travelMode,
  });
  const distances = summarizeScheduleDistances(withTimes, schedule.travelMode);
  return {
    ...schedule,
    items: withTimes,
    ...distances,
    updatedAt: new Date().toISOString(),
  };
}

export function isSamePlace(items: ScheduleItem[], sourceId: string): boolean {
  return items.some((item) => item.sourceId === sourceId);
}
