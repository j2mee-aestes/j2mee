import { requireUserId } from "@/server/auth/requireUser";
import { handleRouteError, jsonOk } from "@/server/http";
import { userRepository } from "@/server/repositories/userRepository";

export async function GET() {
  try {
    const userId = await requireUserId();
    const data = await userRepository.exportUserData(userId);
    return jsonOk(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
