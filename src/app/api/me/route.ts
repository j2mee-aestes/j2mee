import { requireUserId } from "@/server/auth/requireUser";
import { handleRouteError, jsonOk } from "@/server/http";
import { userRepository } from "@/server/repositories/userRepository";
import { preferenceInputSchema } from "@/server/validation/userPayloads";

export async function GET() {
  try {
    const userId = await requireUserId();
    const profile = await userRepository.getProfile(userId);
    if (!profile) {
      return handleRouteError(new Error("notFound"));
    }
    return jsonOk({ profile });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await requireUserId();
    const body = preferenceInputSchema.parse(await request.json());
    const preference = await userRepository.updatePreference(userId, body);
    const profile = await userRepository.getProfile(userId);
    return jsonOk({ preference, profile });
  } catch (error) {
    return handleRouteError(error);
  }
}
