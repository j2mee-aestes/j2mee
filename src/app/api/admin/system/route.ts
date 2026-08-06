import { requireAdmin } from "@/server/admin/adminAuthorization";
import { getSystemStatus } from "@/server/admin/systemStatusService";
import { handleRouteError, jsonOk } from "@/server/http";

export async function GET() {
  try {
    await requireAdmin("admin");
    return jsonOk({ status: getSystemStatus() });
  } catch (error) {
    return handleRouteError(error);
  }
}
