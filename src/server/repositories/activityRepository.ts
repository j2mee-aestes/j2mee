import type { ActivityRun } from "@/types/activity";
import { prisma } from "@/server/db";

function toRun(row: { payload: string }): ActivityRun {
  return JSON.parse(row.payload) as ActivityRun;
}

export const serverActivityRepository = {
  async getAll(userId: string): Promise<ActivityRun[]> {
    const rows = await prisma.activityRunRecord.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(toRun);
  },

  async getById(userId: string, id: string): Promise<ActivityRun | null> {
    const row = await prisma.activityRunRecord.findFirst({
      where: { id, userId },
    });
    return row ? toRun(row) : null;
  },

  async save(userId: string, run: ActivityRun): Promise<ActivityRun> {
    const existing = await prisma.activityRunRecord.findUnique({
      where: { id: run.id },
    });
    if (existing && existing.userId !== userId) {
      throw new Error("forbidden");
    }
    const payload = JSON.stringify(run);
    const startedAt = run.startedAt ? new Date(run.startedAt) : null;
    const completedAt = run.completedAt ? new Date(run.completedAt) : null;
    if (existing) {
      await prisma.activityRunRecord.update({
        where: { id: run.id },
        data: {
          scheduleId: run.scheduleId ?? null,
          status: run.status,
          payload,
          startedAt,
          completedAt,
        },
      });
    } else {
      await prisma.activityRunRecord.create({
        data: {
          id: run.id,
          userId,
          scheduleId: run.scheduleId ?? null,
          status: run.status,
          payload,
          startedAt,
          completedAt,
        },
      });
    }
    return run;
  },

  async delete(userId: string, id: string): Promise<boolean> {
    const result = await prisma.activityRunRecord.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  },

  async clear(userId: string): Promise<number> {
    const result = await prisma.activityRunRecord.deleteMany({
      where: { userId },
    });
    return result.count;
  },
};
