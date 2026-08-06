import { z } from "zod";
import { requireAdmin } from "@/server/admin/adminAuthorization";
import { setRecordStatus } from "@/server/admin/managedPlaceService";
import { handleRouteError, jsonOk } from "@/server/http";

const schema = z.object({
  entityType: z.enum(["fishing", "partner", "waste", "plogging"]),
  sourceId: z.string().min(1),
  recordStatus: z.enum(["draft", "active", "inactive", "archived"]),
  reason: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin("admin");
    const body = schema.parse(await request.json());
    const place = await setRecordStatus({
      adminUserId: admin.id,
      ...body,
    });
    return jsonOk({ place });
  } catch (error) {
    return handleRouteError(error);
  }
}
