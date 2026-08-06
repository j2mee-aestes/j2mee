import { requireUserId } from "@/server/auth/requireUser";
import { handleRouteError, jsonError, jsonOk } from "@/server/http";
import { favoriteRepository } from "@/server/repositories/favoriteRepository";
import { favoriteInputSchema } from "@/server/validation/userPayloads";

export async function GET() {
  try {
    const userId = await requireUserId();
    const favorites = await favoriteRepository.list(userId);
    return jsonOk({ favorites });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const input = favoriteInputSchema.parse(await request.json());
    const favorite = await favoriteRepository.add(userId, input);
    return jsonOk({ favorite }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get("sourceId");
    const placeType = searchParams.get("placeType");
    if (!sourceId || !placeType) {
      return jsonError("invalidPayload", 400);
    }
    favoriteInputSchema.parse({ sourceId, placeType });
    const removed = await favoriteRepository.remove(userId, sourceId, placeType);
    if (!removed) {
      return jsonError("notFound", 404);
    }
    return jsonOk({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
