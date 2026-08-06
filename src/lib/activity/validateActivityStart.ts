import { validateSchedule } from "@/lib/schedule/validateSchedule";
import { getAllFishingSpots } from "@/lib/fishing/fishingSpotRepository";
import { getPloggingRouteById } from "@/lib/environment/ploggingRouteRepository";
import type { DaySchedule, ScheduleWarning } from "@/types/schedule";

export interface ActivityStartValidation {
  canStart: boolean;
  blocking: ScheduleWarning[];
  warnings: ScheduleWarning[];
  info: ScheduleWarning[];
}

export function validateActivityStart(
  schedule: DaySchedule,
): ActivityStartValidation {
  const all = validateSchedule(schedule);
  const blocking: ScheduleWarning[] = [];
  const warnings: ScheduleWarning[] = [];
  const info: ScheduleWarning[] = [];

  if (schedule.items.length === 0) {
    blocking.push({
      id: "no-items",
      severity: "danger",
      title: "일정 항목 없음",
      description: "활동을 시작하려면 장소를 한 개 이상 추가해주세요.",
    });
  }

  for (const item of schedule.items) {
    if (item.type === "fishing") {
      const spot = getAllFishingSpots().find(
        (entry) => entry.id === item.sourceId,
      );
      if (spot?.fishingAllowedStatus === "prohibited") {
        blocking.push({
          id: `block-prohibited-${item.id}`,
          itemId: item.id,
          severity: "danger",
          title: "낚시·출입 금지 장소 포함",
          description: `${item.title}은(는) 금지로 표시되어 있습니다. 해당 항목을 제거하거나 건너뛴 뒤 진행해주세요.`,
        });
      }
    }
    if (item.type === "plogging") {
      const route = getPloggingRouteById(item.sourceId);
      if (!route || route.coordinates.length < 2) {
        warnings.push({
          id: `plogging-invalid-${item.id}`,
          itemId: item.id,
          severity: "warning",
          title: "플로깅 코스 정보 확인 필요",
          description: `${item.title}의 경로 데이터가 부족합니다.`,
        });
      } else if (route.connectedWastePointIds.length === 0) {
        info.push({
          id: `plogging-disposal-${item.id}`,
          itemId: item.id,
          severity: "info",
          title: "배출 장소 미연결",
          description: `${item.title}에 연결된 쓰레기 배출 장소가 없습니다.`,
        });
      }
    }
  }

  for (const warning of all) {
    if (blocking.some((item) => item.id === warning.id)) {
      continue;
    }
    if (warning.severity === "danger") {
      // prohibited already handled as blocking
      if (!warning.id.startsWith("prohibited-")) {
        warnings.push(warning);
      } else {
        blocking.push(warning);
      }
    } else if (warning.severity === "warning") {
      warnings.push(warning);
    } else {
      info.push(warning);
    }
  }

  return {
    canStart: blocking.length === 0 && schedule.items.length > 0,
    blocking,
    warnings,
    info,
  };
}
