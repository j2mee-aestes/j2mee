import { getPartnerById } from "@/lib/partners/partnerRepository";
import { getPloggingRouteById } from "@/lib/environment/ploggingRouteRepository";
import { getAllFishingSpots } from "@/lib/fishing/fishingSpotRepository";
import type { DaySchedule, ScheduleItem, ScheduleWarning } from "@/types/schedule";
import type { BusinessHours } from "@/types/partner";

function todayKst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function parseHm(value: string | undefined): number | null {
  if (!value) {
    return null;
  }
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

function dayKeyFromDate(dateStr: string): BusinessHours["day"] {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
  }).format(new Date(`${dateStr}T12:00:00+09:00`));
  const map: Record<string, BusinessHours["day"]> = {
    Sun: "sunday",
    Mon: "monday",
    Tue: "tuesday",
    Wed: "wednesday",
    Thu: "thursday",
    Fri: "friday",
    Sat: "saturday",
  };
  return map[weekday] ?? "monday";
}

function checkPartnerHours(
  item: ScheduleItem,
  date: string,
): ScheduleWarning | null {
  if (
    item.type !== "market" &&
    item.type !== "restaurant" &&
    item.type !== "processingShop"
  ) {
    return null;
  }

  const partner = getPartnerById(item.sourceId);
  if (!partner) {
    return {
      id: `missing-partner-${item.id}`,
      itemId: item.id,
      severity: "warning",
      title: "장소 정보 확인 필요",
      description: `${item.title}의 상세 정보를 찾을 수 없습니다.`,
    };
  }

  if (!partner.businessHours || partner.businessHours.length === 0) {
    return {
      id: `hours-unknown-${item.id}`,
      itemId: item.id,
      severity: "info",
      title: "영업시간 확인 필요",
      description: `${item.title}의 영업시간이 등록되지 않았습니다. 방문 전 직접 확인해 주세요.`,
    };
  }

  const day = dayKeyFromDate(date);
  const todayHours = partner.businessHours.find((entry) => entry.day === day);
  const visitStart = parseHm(item.startTime);
  const visitEnd = parseHm(item.endTime);

  if (!todayHours || todayHours.isClosed) {
    return {
      id: `closed-${item.id}`,
      itemId: item.id,
      severity: "warning",
      title: "영업시간 외 방문 가능",
      description: `${item.title}은(는) 해당 요일 휴무이거나 영업하지 않을 수 있습니다. 일정을 저장할 수는 있지만 방문 전 확인해 주세요.`,
    };
  }

  const open = parseHm(todayHours.openTime);
  const close = parseHm(todayHours.closeTime);
  if (open === null || close === null || visitStart === null) {
    return {
      id: `hours-check-${item.id}`,
      itemId: item.id,
      severity: "info",
      title: "영업시간 확인 필요",
      description: `${item.title} 방문 전 영업시간을 확인해 주세요.`,
    };
  }

  if (visitStart < open || (visitEnd !== null && visitEnd > close)) {
    return {
      id: `outside-${item.id}`,
      itemId: item.id,
      severity: "warning",
      title: "영업시간 외",
      description: `${item.title} 방문 예정시간이 영업시간(${todayHours.openTime}–${todayHours.closeTime}) 밖일 수 있습니다.`,
    };
  }

  if (visitEnd !== null && close - visitEnd <= 60 && close - visitEnd >= 0) {
    return {
      id: `closing-${item.id}`,
      itemId: item.id,
      severity: "info",
      title: "영업 종료 임박",
      description: `${item.title} 방문 종료 시각이 영업 종료에 가깝습니다.`,
    };
  }

  if (partner.catchPolicy?.reservationRequired) {
    return {
      id: `reservation-${item.id}`,
      itemId: item.id,
      severity: "info",
      title: "사전 문의 권장",
      description: `${item.title}은(는) 외부 수산물 접수 시 사전 문의·현장 검수가 필요할 수 있습니다.`,
    };
  }

  return null;
}

export function validateSchedule(schedule: DaySchedule): ScheduleWarning[] {
  const warnings: ScheduleWarning[] = [];

  if (schedule.items.length === 0) {
    warnings.push({
      id: "empty",
      severity: "info",
      title: "일정 항목 없음",
      description:
        "아직 일정에 추가된 장소가 없습니다. 지도에서 낚시터, 시장·식당 또는 플로깅 코스를 추가해주세요.",
    });
    return warnings;
  }

  if (schedule.date < todayKst()) {
    warnings.push({
      id: "past-date",
      severity: "warning",
      title: "과거 날짜",
      description: "선택한 일정 날짜가 오늘보다 이전입니다.",
    });
  }

  const sourceIds = new Set<string>();
  for (const item of schedule.items) {
    if (sourceIds.has(item.sourceId)) {
      warnings.push({
        id: `dup-${item.sourceId}`,
        itemId: item.id,
        severity: "warning",
        title: "중복 장소",
        description: `${item.title}이(가) 일정에 중복되어 있습니다.`,
      });
    }
    sourceIds.add(item.sourceId);

    const start = parseHm(item.startTime);
    const end = parseHm(item.endTime);
    if (start !== null && end !== null && end < start) {
      warnings.push({
        id: `reverse-${item.id}`,
        itemId: item.id,
        severity: "danger",
        title: "시간 역전",
        description: `${item.title}의 종료시간이 시작시간보다 이릅니다.`,
      });
    }
  }

  const ordered = [...schedule.items].sort((a, b) => a.order - b.order);
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const current = ordered[index];
    const next = ordered[index + 1];
    const currentEnd = parseHm(current.endTime);
    const nextStart = parseHm(next.startTime);
    if (currentEnd !== null && nextStart !== null && nextStart < currentEnd) {
      warnings.push({
        id: `overlap-${current.id}-${next.id}`,
        itemId: next.id,
        severity: "warning",
        title: "시간 겹침",
        description: `${current.title}과(와) ${next.title}의 방문 시간이 겹칩니다. 이동시간을 반영해 조정해 주세요.`,
      });
    }
  }

  const hasFishing = ordered.some((item) => item.type === "fishing");
  if (!hasFishing) {
    warnings.push({
      id: "no-fishing",
      severity: "info",
      title: "낚시터 없음",
      description: "낚시 일정이 필요하다면 먼저 낚시터를 추가해주세요.",
    });
  }

  for (const item of ordered) {
    if (item.type === "fishing") {
      const spot = getAllFishingSpots().find((entry) => entry.id === item.sourceId);
      if (spot?.fishingAllowedStatus === "prohibited") {
        warnings.push({
          id: `prohibited-${item.id}`,
          itemId: item.id,
          severity: "danger",
          title: "출입·낚시 금지 장소",
          description: `${item.title}은(는) 낚시가 금지된 장소로 표시되어 있습니다. 현장 안내를 우선 확인하세요.`,
        });
      } else if (spot?.fishingAllowedStatus === "restricted") {
        warnings.push({
          id: `restricted-${item.id}`,
          itemId: item.id,
          severity: "warning",
          title: "낚시 제한 장소",
          description: `${item.title}은(는) 제한이 있는 낚시터입니다. ${spot.restrictionDescription ?? "현장 규정을 확인하세요."}`,
        });
      }
    }

    if (item.type === "plogging") {
      const route = getPloggingRouteById(item.sourceId);
      if (!route || route.coordinates.length < 2) {
        warnings.push({
          id: `plogging-data-${item.id}`,
          itemId: item.id,
          severity: "warning",
          title: "플로깅 코스 데이터 부족",
          description: `${item.title}의 경로 데이터가 부족합니다.`,
        });
      }
    }

    const hoursWarning = checkPartnerHours(item, schedule.date);
    if (hoursWarning) {
      warnings.push(hoursWarning);
    }
  }

  return warnings;
}
