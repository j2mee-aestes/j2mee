import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_SCHEDULE_START_TIME,
  DEFAULT_TRAVEL_MODE,
  SCHEDULE_TYPE_LABELS,
} from "@/constants/scheduleDefaults";
import { findNearbyPartners } from "@/lib/partners/findNearbyPartners";
import { getAllPartners } from "@/lib/partners/partnerRepository";
import { getAllPloggingRoutes } from "@/lib/environment/ploggingRouteRepository";
import { calculateDistanceKm } from "@/lib/geo/calculateDistance";
import { summarizeScheduleDistances } from "@/lib/schedule/calculateScheduleDistance";
import { calculateScheduleTimes } from "@/lib/schedule/calculateScheduleTimes";
import { createEmptySchedule } from "@/lib/schedule/createScheduleItem";
import type { FishingSpot } from "@/types/fishing";
import type { PartnerPlace } from "@/types/partner";
import type { DaySchedule, ScheduleItem, ScheduleItemType } from "@/types/schedule";

function partnerTypeToSchedule(type: PartnerPlace["type"]): ScheduleItemType {
  if (type === "market" || type === "marketStore") {
    return "market";
  }
  if (type === "processingShop") {
    return "processingShop";
  }
  return "restaurant";
}

function makeItem(input: {
  sourceId: string;
  type: ScheduleItemType;
  title: string;
  address?: string;
  coordinates: ScheduleItem["coordinates"];
  durationMinutes: number;
  order: number;
  sourceLastVerifiedAt?: string;
  ploggingDistanceKm?: number;
  notes?: string[];
}): ScheduleItem {
  return {
    id: `item-${input.sourceId}-${Date.now()}-${input.order}`,
    sourceId: input.sourceId,
    type: input.type,
    title: input.title,
    address: input.address,
    coordinates: input.coordinates,
    durationMinutes: input.durationMinutes,
    order: input.order,
    sourceLastVerifiedAt: input.sourceLastVerifiedAt,
    ploggingDistanceKm: input.ploggingDistanceKm,
    notes: input.notes,
  };
}

export function generateRecommendedSchedule(options: {
  fishingSpot: FishingSpot;
  date: string;
  title?: string;
}): { schedule: DaySchedule | null; message?: string } {
  const { fishingSpot, date } = options;
  const partners = getAllPartners();
  const nearbyPartners = findNearbyPartners({
    origin: fishingSpot.coordinates,
    partners,
    radiusKm: 15,
    sortBy: "distance",
    limit: 8,
  });

  const marketOrShop = nearbyPartners.find(
    (entry) =>
      entry.partner.type === "market" ||
      entry.partner.type === "marketStore" ||
      entry.partner.services.catchCleaning ||
      entry.partner.services.catchCooking,
  );

  const restaurant = nearbyPartners.find(
    (entry) =>
      entry.partner.type === "restaurant" &&
      entry.partner.id !== marketOrShop?.partner.id,
  );

  const routes = getAllPloggingRoutes()
    .map((route) => ({
      route,
      distanceKm: calculateDistanceKm(
        fishingSpot.coordinates,
        route.startPoint,
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const plogging = routes.find((entry) => entry.distanceKm <= 25);

  if (!marketOrShop && !restaurant && !plogging) {
    return {
      schedule: null,
      message:
        "현재 조건으로 추천할 수 있는 주변 장소가 부족합니다. 원하는 장소를 직접 추가해주세요.",
    };
  }

  const items: ScheduleItem[] = [];
  let order = 1;

  items.push(
    makeItem({
      sourceId: fishingSpot.id,
      type: "fishing",
      title: fishingSpot.name,
      address: fishingSpot.address,
      coordinates: fishingSpot.coordinates,
      durationMinutes: DEFAULT_DURATION_MINUTES.fishing,
      order: order++,
      sourceLastVerifiedAt: fishingSpot.lastVerifiedAt,
    }),
  );

  if (marketOrShop) {
    const partner = marketOrShop.partner;
    items.push(
      makeItem({
        sourceId: partner.id,
        type: partnerTypeToSchedule(partner.type),
        title: partner.name,
        address: partner.address,
        coordinates: partner.coordinates,
        durationMinutes:
          DEFAULT_DURATION_MINUTES[partnerTypeToSchedule(partner.type)],
        order: order++,
        sourceLastVerifiedAt: partner.lastVerifiedAt,
        notes: partner.catchPolicy?.reservationRequired
          ? ["사전 문의 권장", "현장 검수 필요 가능"]
          : undefined,
      }),
    );
  }

  if (restaurant && restaurant.partner.id !== marketOrShop?.partner.id) {
    const partner = restaurant.partner;
    // Prefer at most one extra dining stop if market was cleaning-only
    if (
      !marketOrShop ||
      marketOrShop.partner.type === "market" ||
      marketOrShop.partner.type === "processingShop"
    ) {
      items.push(
        makeItem({
          sourceId: partner.id,
          type: "restaurant",
          title: partner.name,
          address: partner.address,
          coordinates: partner.coordinates,
          durationMinutes: DEFAULT_DURATION_MINUTES.restaurant,
          order: order++,
          sourceLastVerifiedAt: partner.lastVerifiedAt,
        }),
      );
    }
  }

  if (plogging) {
    const route = plogging.route;
    items.push(
      makeItem({
        sourceId: route.id,
        type: "plogging",
        title: route.name,
        address: "플로깅 코스 시작점",
        coordinates: route.startPoint,
        durationMinutes: route.estimatedMinutes || DEFAULT_DURATION_MINUTES.plogging,
        order: order++,
        sourceLastVerifiedAt: route.lastVerifiedAt,
        ploggingDistanceKm: route.distanceKm,
        notes: route.cautionNotes?.slice(0, 2),
      }),
    );
  }

  const withTimes = calculateScheduleTimes(items, {
    firstStartTime: DEFAULT_SCHEDULE_START_TIME,
    travelMode: DEFAULT_TRAVEL_MODE,
  });
  const distances = summarizeScheduleDistances(withTimes, DEFAULT_TRAVEL_MODE);
  const now = new Date().toISOString();

  const schedule: DaySchedule = {
    ...createEmptySchedule({
      date,
      title:
        options.title ??
        `${fishingSpot.name} 하루 일정 (${SCHEDULE_TYPE_LABELS.fishing})`,
    }),
    items: withTimes,
    ...distances,
    travelMode: DEFAULT_TRAVEL_MODE,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  return { schedule };
}
