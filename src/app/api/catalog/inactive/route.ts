import { listInactiveSourceIds } from "@/server/admin/managedPlaceService";
import { handleRouteError, jsonOk } from "@/server/http";

/** Public: list non-active place ids so the map can hide them. */
export async function GET() {
  try {
    const rows = await listInactiveSourceIds();
    return jsonOk({
      inactive: rows.map((row) => ({
        entityType: row.entityType,
        sourceId: row.sourceId,
      })),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
