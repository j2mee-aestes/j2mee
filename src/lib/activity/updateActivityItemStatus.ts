import type {
  ActivityExecutionItem,
  ActivityItemResult,
  ActivityRun,
} from "@/types/activity";

function touch(run: ActivityRun): ActivityRun {
  return { ...run, updatedAt: new Date().toISOString() };
}

/** Ensure only one item is inProgress. */
export function startActivityItem(
  run: ActivityRun,
  itemId: string,
): ActivityRun {
  const now = new Date().toISOString();
  const items = run.items.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        status: "inProgress" as const,
        startedAt: item.startedAt ?? now,
      };
    }
    if (item.status === "inProgress") {
      return { ...item, status: "notStarted" as const };
    }
    return item;
  });

  return touch({
    ...run,
    status: run.status === "ready" ? "inProgress" : run.status,
    startedAt: run.startedAt ?? now,
    items,
  });
}

export function completeActivityItem(
  run: ActivityRun,
  itemId: string,
  result?: ActivityItemResult,
): ActivityRun {
  const now = new Date().toISOString();
  const items = run.items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }
    return {
      ...item,
      status: "completed" as const,
      completedAt: now,
      startedAt: item.startedAt ?? now,
      result: result ?? item.result,
    };
  });
  return touch({ ...run, items });
}

export function skipActivityItem(
  run: ActivityRun,
  itemId: string,
  memo?: string,
): ActivityRun {
  const now = new Date().toISOString();
  const items = run.items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }
    return {
      ...item,
      status: "skipped" as const,
      completedAt: now,
      result: memo
        ? ({
            ...(item.result ??
              (item.type === "fishing"
                ? { type: "fishing", catchRecorded: false }
                : item.type === "plogging"
                  ? { type: "plogging", completedRoute: false }
                  : {
                      type: item.type as
                        | "market"
                        | "restaurant"
                        | "processingShop",
                      visited: false,
                    })),
            memo,
          } as ActivityItemResult)
        : item.result,
    };
  });
  return touch({ ...run, items });
}

export function updateActivityItemResult(
  run: ActivityRun,
  itemId: string,
  result: ActivityItemResult,
): ActivityRun {
  const items = run.items.map((item) =>
    item.id === itemId ? { ...item, result } : item,
  );
  return touch({ ...run, items });
}

export function reopenActivityItem(
  run: ActivityRun,
  itemId: string,
): ActivityRun {
  const items = run.items.map((item) => {
    if (item.id !== itemId) {
      if (item.status === "inProgress") {
        return { ...item, status: "notStarted" as const };
      }
      return item;
    }
    return {
      ...item,
      status: "inProgress" as const,
      completedAt: undefined,
    };
  });
  return touch({
    ...run,
    status: run.status === "completed" ? "inProgress" : run.status,
    items,
  });
}

export function getCurrentActivityItem(
  run: ActivityRun,
): ActivityExecutionItem | null {
  return (
    run.items.find((item) => item.status === "inProgress") ??
    run.items.find((item) => item.status === "notStarted") ??
    null
  );
}

export function getNextActivityItem(
  run: ActivityRun,
  currentId?: string,
): ActivityExecutionItem | null {
  const ordered = [...run.items].sort((a, b) => a.order - b.order);
  if (currentId) {
    const index = ordered.findIndex((item) => item.id === currentId);
    return ordered.slice(index + 1).find((item) => item.status === "notStarted") ??
      null;
  }
  const current = getCurrentActivityItem(run);
  if (!current) {
    return null;
  }
  return (
    ordered
      .filter((item) => item.order > current.order)
      .find((item) => item.status === "notStarted") ?? null
  );
}

export function canCompleteRun(run: ActivityRun): boolean {
  return (
    run.items.length > 0 &&
    run.items.every(
      (item) => item.status === "completed" || item.status === "skipped",
    )
  );
}

export function finishActivityRun(run: ActivityRun): ActivityRun {
  const now = new Date().toISOString();
  return touch({
    ...run,
    status: "completed",
    completedAt: now,
    startedAt: run.startedAt ?? now,
  });
}

export function cancelActivityRun(run: ActivityRun): ActivityRun {
  return touch({
    ...run,
    status: "cancelled",
  });
}
