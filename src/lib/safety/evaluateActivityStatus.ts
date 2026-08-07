import type {
  ActivityEvaluation,
  ActivityStatus,
  FishingAllowedStatus,
  WeatherData,
} from "@/types/fishing";
import { SAFETY_THRESHOLDS } from "@/constants/safetyThresholds";

interface EvaluateInput {
  fishingAllowedStatus?: FishingAllowedStatus;
  weather?: WeatherData | null;
}

export type ActivityReason = {
  key: string;
  values?: Record<string, string | number>;
};

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
  const reasons: ActivityReason[] = [];
  let status: ActivityStatus = "normal";

  const raise = (
    next: ActivityStatus,
    key: string,
    values?: Record<string, string | number>,
  ) => {
    reasons.push({ key, values });
    if (rank(next) > rank(status)) {
      status = next;
    }
  };

  if (input.fishingAllowedStatus === "prohibited") {
    raise("restricted", "safety.reason.fishingProhibited");
  } else if (input.fishingAllowedStatus === "restricted") {
    raise("restricted", "safety.reason.fishingRestricted");
  } else if (input.fishingAllowedStatus === "unknown") {
    raise("unknown", "safety.reason.fishingUnknown");
  }

  const weather = input.weather;
  if (!weather) {
    raise("unknown", "safety.reason.weatherMissing");
  } else {
    const dangerWarning = weather.warnings?.find((w) => w.severity === "danger");
    const warning = weather.warnings?.find((w) => w.severity === "warning");

    if (dangerWarning) {
      raise("notRecommended", "safety.reason.weatherAlert", {
        title: dangerWarning.title,
      });
    } else if (warning) {
      raise("caution", "safety.reason.weatherAlert", {
        title: warning.title,
      });
    }

    if (
      weather.windSpeedMs !== undefined &&
      weather.windSpeedMs >= SAFETY_THRESHOLDS.windNotRecommendedMs
    ) {
      raise("notRecommended", "safety.reason.windStrong", {
        value: weather.windSpeedMs.toFixed(1),
      });
    } else if (
      weather.windSpeedMs !== undefined &&
      weather.windSpeedMs >= SAFETY_THRESHOLDS.windCautionMs
    ) {
      raise("caution", "safety.reason.windCaution", {
        value: weather.windSpeedMs.toFixed(1),
      });
    }

    if (
      weather.waveHeightM !== undefined &&
      weather.waveHeightM >= SAFETY_THRESHOLDS.waveNotRecommendedM
    ) {
      raise("notRecommended", "safety.reason.waveHigh", {
        value: weather.waveHeightM.toFixed(1),
      });
    } else if (
      weather.waveHeightM !== undefined &&
      weather.waveHeightM >= SAFETY_THRESHOLDS.waveCautionM
    ) {
      raise("caution", "safety.reason.waveCaution", {
        value: weather.waveHeightM.toFixed(1),
      });
    }

    if (
      weather.precipitationProbability !== undefined &&
      weather.precipitationProbability >= SAFETY_THRESHOLDS.precipCautionPercent
    ) {
      raise("caution", "safety.reason.precipHigh", {
        value: weather.precipitationProbability,
      });
    }
  }

  const unique = new Map<string, ActivityReason>();
  for (const reason of reasons) {
    const id = `${reason.key}:${JSON.stringify(reason.values ?? {})}`;
    if (!unique.has(id)) unique.set(id, reason);
  }
  const uniqueReasons = [...unique.values()];

  return {
    status,
    label: status,
    reasons:
      uniqueReasons.length > 0
        ? uniqueReasons.map((item) =>
            item.values ? `${item.key}::${JSON.stringify(item.values)}` : item.key,
          )
        : ["safety.reason.noAlerts"],
    evaluatedAt: new Date().toISOString(),
  };
}

export function parseActivityReason(raw: string): ActivityReason {
  const sep = raw.indexOf("::");
  if (sep === -1) return { key: raw };
  try {
    return {
      key: raw.slice(0, sep),
      values: JSON.parse(raw.slice(sep + 2)) as Record<string, string | number>,
    };
  } catch {
    return { key: raw };
  }
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
    return "unknown";
  }
  const diffMs = Math.max(0, now - fetched);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return "justNow";
  }
  if (minutes < 60) {
    return `m:${minutes}`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `h:${hours}`;
  }
  const days = Math.floor(hours / 24);
  return `d:${days}`;
}
