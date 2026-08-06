import { requireUserId } from "@/server/auth/requireUser";
import { handleRouteError, jsonError, jsonOk } from "@/server/http";
import { serverScheduleRepository } from "@/server/repositories/scheduleRepository";
import { schedulePayloadSchema } from "@/server/validation/userPayloads";
import type { DaySchedule } from "@/types/schedule";

export async function GET() {
  try {
    const userId = await requireUserId();
    const schedules = await serverScheduleRepository.getAll(userId);
    return jsonOk({ schedules });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const schedule = schedulePayloadSchema.parse(
      await request.json(),
    ) as unknown as DaySchedule;
    const saved = await serverScheduleRepository.save(userId, schedule);
    return jsonOk({ schedule: saved }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "1";
    if (all) {
      const count = await serverScheduleRepository.clear(userId);
      return jsonOk({ deleted: count });
    }
    const id = searchParams.get("id");
    if (!id) {
      return jsonError("invalidPayload", 400);
    }
    const removed = await serverScheduleRepository.delete(userId, id);
    if (!removed) {
      return jsonError("notFound", 404);
    }
    return jsonOk({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
