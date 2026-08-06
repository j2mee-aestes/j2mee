import type {
  ActivityRun,
  CompletionBadge,
  CompletionBadgeId,
} from "@/types/activity";
import { loadSavedActivityRuns } from "@/lib/activity/activityRunStorage";

const BADGE_META: Record<
  CompletionBadgeId,
  { label: string; description: string }
> = {
  firstCompletion: {
    label: "첫 일정 완료",
    description: "첫 번째 바다 일정을 완료했습니다.",
  },
  ploggingJoined: {
    label: "플로깅 참여",
    description: "플로깅 코스 활동을 완료했습니다.",
  },
  fishingAndPlogging: {
    label: "낚시와 플로깅 함께 완료",
    description: "낚시와 플로깅을 한 일정에서 모두 마쳤습니다.",
  },
  marketVisit: {
    label: "지역 시장 방문",
    description: "수산시장·식당·손질 장소를 방문 기록했습니다.",
  },
};

export function generateCompletionBadges(
  run: ActivityRun,
  options?: { existingCompletedCount?: number },
): CompletionBadge[] {
  const badges: CompletionBadge[] = [];
  const existing =
    options?.existingCompletedCount ??
    loadSavedActivityRuns().filter((item) => item.status === "completed").length;

  // Current run not yet counted if just finishing
  if (existing <= 1) {
    badges.push({ id: "firstCompletion", ...BADGE_META.firstCompletion });
  }

  const hasPlogging = run.items.some(
    (item) =>
      item.type === "plogging" &&
      item.status === "completed" &&
      item.result?.type === "plogging" &&
      item.result.completedRoute,
  );
  if (hasPlogging) {
    badges.push({ id: "ploggingJoined", ...BADGE_META.ploggingJoined });
  }

  const hasFishing = run.items.some(
    (item) => item.type === "fishing" && item.status === "completed",
  );
  if (hasFishing && hasPlogging) {
    badges.push({
      id: "fishingAndPlogging",
      ...BADGE_META.fishingAndPlogging,
    });
  }

  const hasMarket = run.items.some(
    (item) =>
      (item.type === "market" ||
        item.type === "restaurant" ||
        item.type === "processingShop") &&
      item.status === "completed",
  );
  if (hasMarket) {
    badges.push({ id: "marketVisit", ...BADGE_META.marketVisit });
  }

  return badges;
}
