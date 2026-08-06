import {
  loadSavedActivityRuns,
  persistSavedActivityRuns,
} from "@/lib/activity/activityRunStorage";
import type { ActivityRunRepository } from "@/types/activity";

export const localActivityRunRepository: ActivityRunRepository = {
  async getAll() {
    return loadSavedActivityRuns().sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  },
  async getById(id) {
    return loadSavedActivityRuns().find((run) => run.id === id) ?? null;
  },
  async save(activityRun) {
    const existing = loadSavedActivityRuns().filter(
      (run) => run.id !== activityRun.id,
    );
    persistSavedActivityRuns([activityRun, ...existing]);
  },
  async delete(id) {
    persistSavedActivityRuns(
      loadSavedActivityRuns().filter((run) => run.id !== id),
    );
  },
};
