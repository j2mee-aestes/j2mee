import { requireUserId } from "@/server/auth/requireUser";
import { handleRouteError, jsonError, jsonOk } from "@/server/http";
import { serverActivityRepository } from "@/server/repositories/activityRepository";
import { activityPayloadSchema } from "@/server/validation/userPayloads";
import type { ActivityRun } from "@/types/activity";

export async function GET() {
  try {
    const userId = await requireUserId();
    const activityRuns = await serverActivityRepository.getAll(userId);
    return jsonOk({ activityRuns });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const run = activityPayloadSchema.parse(
      await request.json(),
    ) as unknown as ActivityRun;
    const saved = await serverActivityRepository.save(userId, run);
    return jsonOk({ activityRun: saved }, { status: 201 });
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
      const count = await serverActivityRepository.clear(userId);
      return jsonOk({ deleted: count });
    }
    const id = searchParams.get("id");
    if (!id) {
      return jsonError("invalidPayload", 400);
    }
    const removed = await serverActivityRepository.delete(userId, id);
    if (!removed) {
      return jsonError("notFound", 404);
    }
    return jsonOk({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
