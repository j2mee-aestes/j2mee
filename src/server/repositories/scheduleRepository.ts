import type { DaySchedule } from "@/types/schedule";
import { prisma } from "@/server/db";

function toSchedule(row: { payload: string }): DaySchedule {
  return JSON.parse(row.payload) as DaySchedule;
}

export const serverScheduleRepository = {
  async getAll(userId: string): Promise<DaySchedule[]> {
    const rows = await prisma.savedSchedule.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(toSchedule);
  },

  async getById(userId: string, id: string): Promise<DaySchedule | null> {
    const row = await prisma.savedSchedule.findFirst({
      where: { id, userId },
    });
    return row ? toSchedule(row) : null;
  },

  async save(userId: string, schedule: DaySchedule): Promise<DaySchedule> {
    const existing = await prisma.savedSchedule.findUnique({
      where: { id: schedule.id },
    });
    if (existing && existing.userId !== userId) {
      throw new Error("forbidden");
    }
    const payload = JSON.stringify(schedule);
    if (existing) {
      await prisma.savedSchedule.update({
        where: { id: schedule.id },
        data: {
          title: schedule.title,
          date: schedule.date,
          status: schedule.status,
          payload,
        },
      });
    } else {
      await prisma.savedSchedule.create({
        data: {
          id: schedule.id,
          userId,
          title: schedule.title,
          date: schedule.date,
          status: schedule.status,
          payload,
        },
      });
    }
    return schedule;
  },

  async delete(userId: string, id: string): Promise<boolean> {
    const result = await prisma.savedSchedule.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  },

  async clear(userId: string): Promise<number> {
    const result = await prisma.savedSchedule.deleteMany({ where: { userId } });
    return result.count;
  },
};
