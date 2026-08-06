import { apiJson } from "@/lib/auth/clientApi";
import { localActivityRunRepository } from "@/lib/activity/localActivityRunRepository";
import type { ActivityRun, ActivityRunRepository } from "@/types/activity";

async function isAuthed(): Promise<boolean> {
  const result = await apiJson<{ profile: unknown }>("/api/me");
  return result.ok;
}

export const hybridActivityRunRepository: ActivityRunRepository = {
  async getAll() {
    if (await isAuthed()) {
      const result = await apiJson<{ activityRuns: ActivityRun[] }>(
        "/api/activities",
      );
      if (result.ok) {
        return result.data.activityRuns;
      }
    }
    return localActivityRunRepository.getAll();
  },
  async getById(id) {
    if (await isAuthed()) {
      const all = await this.getAll();
      return all.find((item) => item.id === id) ?? null;
    }
    return localActivityRunRepository.getById(id);
  },
  async save(activityRun) {
    if (await isAuthed()) {
      const result = await apiJson("/api/activities", {
        method: "POST",
        body: JSON.stringify(activityRun),
      });
      if (!result.ok) {
        throw new Error(result.error);
      }
      return;
    }
    await localActivityRunRepository.save(activityRun);
  },
  async delete(id) {
    if (await isAuthed()) {
      const result = await apiJson(
        `/api/activities?id=${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!result.ok) {
        throw new Error(result.error);
      }
      return;
    }
    await localActivityRunRepository.delete(id);
  },
};
