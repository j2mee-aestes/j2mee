import { requireAdmin } from "@/server/admin/adminAuthorization";
import { listAuditLogs } from "@/server/admin/auditService";
import { handleRouteError, jsonOk } from "@/server/http";

export async function GET(request: Request) {
  try {
    await requireAdmin("admin");
    const limit = Number(new URL(request.url).searchParams.get("limit") ?? "50");
    const logs = await listAuditLogs(limit);
    return jsonOk({ logs });
  } catch (error) {
    return handleRouteError(error);
  }
}
