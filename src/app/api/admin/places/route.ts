import { z } from "zod";
import { requireAdmin } from "@/server/admin/adminAuthorization";
import {
  listManagedPlaces,
  upsertManagedPlace,
} from "@/server/admin/managedPlaceService";
import { handleRouteError, jsonError, jsonOk } from "@/server/http";

const entityTypeSchema = z.enum(["fishing", "partner", "waste", "plogging"]);

export async function GET(request: Request) {
  try {
    await requireAdmin("admin");
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const parsed = entityType
      ? entityTypeSchema.parse(entityType)
      : undefined;
    const places = await listManagedPlaces(parsed);
    return jsonOk({ places });
  } catch (error) {
    return handleRouteError(error);
  }
}

const upsertSchema = z.object({
  entityType: entityTypeSchema,
  sourceId: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  recordStatus: z.enum(["draft", "active", "inactive", "archived"]),
  verificationStatus: z.string().min(1).max(40),
  lastVerifiedAt: z.string().nullable().optional(),
  payload: z.record(z.string(), z.unknown()),
  changeReason: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin("admin");
    const body = upsertSchema.parse(await request.json());
    if (
      (body.payload.fishingAllowedStatus === "prohibited" ||
        body.payload.fishingAllowedStatus === "restricted") &&
      !body.changeReason
    ) {
      return jsonError("changeReasonRequired", 400);
    }
    const place = await upsertManagedPlace({
      adminUserId: admin.id,
      ...body,
    });
    return jsonOk({ place }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
