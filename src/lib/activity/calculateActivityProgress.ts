import type { ActivityProgress, ActivityRun } from "@/types/activity";

export function calculateActivityProgress(
  run: ActivityRun,
): ActivityProgress {
  const total = run.items.length;
  const completed = run.items.filter((item) => item.status === "completed").length;
  const skipped = run.items.filter((item) => item.status === "skipped").length;
  const inProgress = run.items.filter(
    (item) => item.status === "inProgress",
  ).length;
  const remaining = Math.max(0, total - completed - skipped);
  const percent =
    total === 0 ? 0 : Math.round(((completed + skipped) / total) * 100);

  return {
    total,
    completed,
    skipped,
    remaining,
    inProgress,
    percent,
  };
}
