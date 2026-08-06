import type {
  ActivityEvaluation,
  ActivityStatus,
  FishingAllowedStatus,
  WeatherData,
} from "@/types/fishing";
import {
  ACTIVITY_STATUS_LABELS,
  SAFETY_THRESHOLDS,
} from "@/constants/safetyThresholds";

interface EvaluateInput {
  fishingAllowedStatus?: FishingAllowedStatus;
  weather?: WeatherData | null;
}

function rank(status: ActivityStatus): number {
  switch (status) {
    case "restricted":
      return 4;
    case "notRecommended":
      return 3;
    case "caution":
      return 2;
    case "unknown":
      return 1;
    default:
      return 0;
  }
}

export function evaluateActivityStatus(
  input: EvaluateInput,
): ActivityEvaluation {
  const reasons: string[] = [];
  let status: ActivityStatus = "normal";

  const raise = (next: ActivityStatus, reason: string) => {
    reasons.push(reason);
    if (rank(next) > rank(status)) {
      status = next;
    }
  };

  if (input.fishingAllowedStatus === "prohibited") {
    raise("restricted", "이 장소는 낚시가 금지되어 있습니다.");
  } else if (input.fishingAllowedStatus === "restricted") {
    raise("restricted", "이 장소는 일부 출입 또는 낚시 제한이 있습니다.");
  } else if (input.fishingAllowedStatus === "unknown") {
    raise("unknown", "낚시 가능 여부를 확인할 수 없습니다.");
  }

  const weather = input.weather;
  if (!weather) {
    raise("unknown", "날씨·해양 정보가 없어 상태를 완전히 판단할 수 없습니다.");
  } else {
    const dangerWarning = weather.warnings?.find((w) => w.severity === "danger");
    const warning = weather.warnings?.find((w) => w.severity === "warning");

    if (dangerWarning) {
      raise(
        "notRecommended",
        `기상특보: ${dangerWarning.title}`,
      );
    } else if (warning) {
      raise("caution", `기상특보: ${warning.title}`);
    }

    if (
      weather.windSpeedMs !== undefined &&
      weather.windSpeedMs >= SAFETY_THRESHOLDS.windNotRecommendedMs
    ) {
      raise(
        "notRecommended",
        `풍속이 강합니다 (${weather.windSpeedMs.toFixed(1)}m/s).`,
      );
    } else if (
      weather.windSpeedMs !== undefined &&
      weather.windSpeedMs >= SAFETY_THRESHOLDS.windCautionMs
    ) {
      raise(
        "caution",
        `풍속이 다소 강합니다 (${weather.windSpeedMs.toFixed(1)}m/s).`,
      );
    }

    if (
      weather.waveHeightM !== undefined &&
      weather.waveHeightM >= SAFETY_THRESHOLDS.waveNotRecommendedM
    ) {
      raise(
        "notRecommended",
        `파고가 높습니다 (${weather.waveHeightM.toFixed(1)}m).`,
      );
    } else if (
      weather.waveHeightM !== undefined &&
      weather.waveHeightM >= SAFETY_THRESHOLDS.waveCautionM
    ) {
      raise(
        "caution",
        `파고에 주의가 필요합니다 (${weather.waveHeightM.toFixed(1)}m).`,
      );
    }

    if (
      weather.precipitationProbability !== undefined &&
      weather.precipitationProbability >= SAFETY_THRESHOLDS.precipCautionPercent
    ) {
      raise(
        "caution",
        `강수 확률이 높습니다 (${weather.precipitationProbability}%).`,
      );
    }
  }

  const uniqueReasons = [...new Set(reasons)];

  return {
    status,
    label: ACTIVITY_STATUS_LABELS[status],
    reasons:
      uniqueReasons.length > 0
        ? uniqueReasons
        : ["현재 공개된 정보 기준으로 특별한 주의 신호가 없습니다."],
    evaluatedAt: new Date().toISOString(),
  };
}

export function isStaleData(
  fetchedAt: string,
  staleAfterMs: number,
  now = Date.now(),
): boolean {
  const fetched = Date.parse(fetchedAt);
  if (Number.isNaN(fetched)) {
    return true;
  }
  return now - fetched > staleAfterMs;
}

export function formatRelativeTime(
  iso: string,
  now = Date.now(),
): string {
  const fetched = Date.parse(iso);
  if (Number.isNaN(fetched)) {
    return "시각 미상";
  }
  const diffMs = Math.max(0, now - fetched);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return "방금 전";
  }
  if (minutes < 60) {
    return `${minutes}분 전`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}
