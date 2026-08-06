import {
  loadSavedSchedules,
  persistSavedSchedules,
} from "@/lib/schedule/scheduleStorage";
import type { ScheduleRepository } from "@/types/schedule";

export const localScheduleRepository: ScheduleRepository = {
  async getAll() {
    return loadSavedSchedules().sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  },
  async getById(id) {
    return loadSavedSchedules().find((schedule) => schedule.id === id) ?? null;
  },
  async save(schedule) {
    const existing = loadSavedSchedules().filter(
      (item) => item.id !== schedule.id,
    );
    persistSavedSchedules([schedule, ...existing]);
  },
  async delete(id) {
    persistSavedSchedules(
      loadSavedSchedules().filter((schedule) => schedule.id !== id),
    );
  },
};
