import { apiJson } from "@/lib/auth/clientApi";
import { localScheduleRepository } from "@/lib/schedule/localScheduleRepository";
import type { DaySchedule, ScheduleRepository } from "@/types/schedule";

async function isAuthed(): Promise<boolean> {
  const result = await apiJson<{ profile: unknown }>("/api/me");
  return result.ok;
}

export const hybridScheduleRepository: ScheduleRepository = {
  async getAll() {
    if (await isAuthed()) {
      const result = await apiJson<{ schedules: DaySchedule[] }>("/api/schedules");
      if (result.ok) {
        return result.data.schedules;
      }
    }
    return localScheduleRepository.getAll();
  },
  async getById(id) {
    if (await isAuthed()) {
      const all = await this.getAll();
      return all.find((item) => item.id === id) ?? null;
    }
    return localScheduleRepository.getById(id);
  },
  async save(schedule) {
    if (await isAuthed()) {
      const result = await apiJson("/api/schedules", {
        method: "POST",
        body: JSON.stringify(schedule),
      });
      if (!result.ok) {
        throw new Error(result.error);
      }
      return;
    }
    await localScheduleRepository.save(schedule);
  },
  async delete(id) {
    if (await isAuthed()) {
      const result = await apiJson(`/api/schedules?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!result.ok) {
        throw new Error(result.error);
      }
      return;
    }
    await localScheduleRepository.delete(id);
  },
};
