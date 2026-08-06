import { requireUserId } from "@/server/auth/requireUser";
import { handleRouteError, jsonOk } from "@/server/http";
import { serverActivityRepository } from "@/server/repositories/activityRepository";
import { favoriteRepository } from "@/server/repositories/favoriteRepository";
import { serverScheduleRepository } from "@/server/repositories/scheduleRepository";
import { importBodySchema } from "@/server/validation/userPayloads";
import type { ActivityRun } from "@/types/activity";
import type { DaySchedule } from "@/types/schedule";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = importBodySchema.parse(await request.json());

    let importedSchedules = 0;
    let importedRuns = 0;
    let importedFavorites = 0;
    let skipped = 0;

    for (const schedule of body.schedules ?? []) {
      const existing = await serverScheduleRepository.getById(
        userId,
        schedule.id,
      );
      if (existing) {
        skipped += 1;
        continue;
      }
      await serverScheduleRepository.save(
        userId,
        schedule as unknown as DaySchedule,
      );
      importedSchedules += 1;
    }

    for (const run of body.activityRuns ?? []) {
      const existing = await serverActivityRepository.getById(userId, run.id);
      if (existing) {
        skipped += 1;
        continue;
      }
      await serverActivityRepository.save(
        userId,
        run as unknown as ActivityRun,
      );
      importedRuns += 1;
    }

    for (const favorite of body.favorites ?? []) {
      await favoriteRepository.add(userId, favorite);
      importedFavorites += 1;
    }

    return jsonOk({
      importedSchedules,
      importedRuns,
      importedFavorites,
      skipped,
      clearLocalAfterImport: Boolean(body.clearLocalAfterImport),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
