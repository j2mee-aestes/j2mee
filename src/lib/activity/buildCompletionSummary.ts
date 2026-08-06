import { calculateActivityProgress } from "@/lib/activity/calculateActivityProgress";
import type {
  ActivityCompletionSummary,
  ActivityRun,
  CompletionPlaceSummary,
  FishingCompletionSummary,
  PartnerCompletionSummary,
  PloggingCompletionSummaryData,
} from "@/types/activity";

export function buildCompletionSummary(
  run: ActivityRun,
): ActivityCompletionSummary {
  const progress = calculateActivityProgress(run);
  const visitedPlaces: CompletionPlaceSummary[] = [...run.items]
    .sort((a, b) => a.order - b.order)
    .filter(
      (item) => item.status === "completed" || item.status === "skipped",
    )
    .map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      status: item.status === "skipped" ? "skipped" : "completed",
      startedAt: item.startedAt,
      completedAt: item.completedAt,
      plannedStartTime: item.plannedStartTime,
      memo:
        item.result && "memo" in item.result
          ? item.result.memo
          : undefined,
    }));

  const fishingItems = run.items.filter((item) => item.type === "fishing");
  let fishingSummary: FishingCompletionSummary | undefined;
  if (fishingItems.length > 0) {
    const recordedCatches: FishingCompletionSummary["recordedCatches"] = [];
    const notCaughtTitles: string[] = [];
    const unrecordedTitles: string[] = [];

    fishingItems.forEach((item) => {
      if (item.status === "skipped") {
        return;
      }
      const result = item.result?.type === "fishing" ? item.result : null;
      if (!result || result.catchChoice === "skipped" || (!result.catchRecorded && !result.catchChoice)) {
        unrecordedTitles.push(item.title);
        return;
      }
      if (result.catchChoice === "notCaught" || (result.catchRecorded === false && result.catchChoice !== "caught")) {
        notCaughtTitles.push(item.title);
        return;
      }
      if (result.catchChoice === "caught" || result.catchRecorded) {
        recordedCatches.push({
          title: item.title,
          species: result.caughtSpecies ?? [],
          count: result.catchCount,
          memo: result.memo,
        });
      }
    });

    fishingSummary = {
      spotTitles: fishingItems.map((item) => item.title),
      recordedCatches,
      notCaughtTitles,
      unrecordedTitles,
    };
  }

  const partnerItems = run.items.filter(
    (item) =>
      item.type === "market" ||
      item.type === "restaurant" ||
      item.type === "processingShop",
  );
  let partnerSummary: PartnerCompletionSummary | undefined;
  if (partnerItems.length > 0) {
    partnerSummary = {
      visits: partnerItems.map((item) => {
        const result =
          item.result && item.result.type !== "fishing" && item.result.type !== "plogging"
            ? item.result
            : null;
        return {
          title: item.title,
          type: item.type,
          status: item.status === "skipped" ? "skipped" : "completed",
          serviceUsed: result?.serviceUsed ?? [],
          memo: result?.memo,
        };
      }),
    };
  }

  const ploggingItems = run.items.filter((item) => item.type === "plogging");
  let ploggingSummary: PloggingCompletionSummaryData | undefined;
  if (ploggingItems.length > 0) {
    const wasteTypes = new Set<string>();
    let totalBagCount = 0;
    const disposalPointNames: string[] = [];
    let completedRouteCount = 0;
    let plannedDistanceKm = 0;

    ploggingItems.forEach((item) => {
      plannedDistanceKm += item.ploggingDistanceKm ?? 0;
      const result = item.result?.type === "plogging" ? item.result : null;
      if (item.status === "completed" && result?.completedRoute) {
        completedRouteCount += 1;
      }
      result?.wasteTypes?.forEach((type) => wasteTypes.add(type));
      if (typeof result?.bagCount === "number") {
        totalBagCount += result.bagCount;
      }
      if (result?.disposalWastePointName) {
        disposalPointNames.push(result.disposalWastePointName);
      }
    });

    ploggingSummary = {
      completedRouteCount,
      plannedDistanceKm,
      wasteTypes: [...wasteTypes],
      totalBagCount,
      disposalPointNames,
      routeTitles: ploggingItems.map((item) => item.title),
    };
  }

  return {
    activityRunId: run.id,
    scheduleId: run.scheduleId,
    title: run.scheduleTitle,
    date: run.date,
    completedItemCount: progress.completed,
    skippedItemCount: progress.skipped,
    totalItemCount: progress.total,
    plannedDistanceKm: run.plannedDistanceKm,
    plannedDurationMinutes: run.plannedDurationMinutes,
    startedAt: run.startedAt,
    completedAt: run.completedAt ?? new Date().toISOString(),
    visitedPlaces,
    fishingSummary,
    partnerSummary,
    ploggingSummary,
  };
}
