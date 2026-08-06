import { z } from "zod";
import { requireAdmin } from "@/server/admin/adminAuthorization";
import {
  listPlaceReports,
  updatePlaceReport,
} from "@/server/admin/reportService";
import { handleRouteError, jsonOk } from "@/server/http";

export async function GET(request: Request) {
  try {
    await requireAdmin("admin");
    const status = new URL(request.url).searchParams.get("status") as
      | "submitted"
      | "reviewing"
      | "resolved"
      | "rejected"
      | null;
    const reports = await listPlaceReports(status ?? undefined);
    return jsonOk({ reports });
  } catch (error) {
    return handleRouteError(error);
  }
}

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["submitted", "reviewing", "resolved", "rejected"]),
  adminNote: z.string().max(2000).optional(),
  deactivatePlace: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin("admin");
    const body = updateSchema.parse(await request.json());
    const report = await updatePlaceReport({
      adminUserId: admin.id,
      ...body,
    });
    return jsonOk({ report });
  } catch (error) {
    return handleRouteError(error);
  }
}
