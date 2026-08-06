import { requireAdmin } from "@/server/admin/adminAuthorization";
import { dashboardStats } from "@/server/admin/managedPlaceService";
import { handleRouteError, jsonOk } from "@/server/http";

export async function GET() {
  try {
    await requireAdmin("admin");
    const stats = await dashboardStats();
    return jsonOk({ stats });
  } catch (error) {
    return handleRouteError(error);
  }
}
