import { z } from "zod";
import { requireAdmin } from "@/server/admin/adminAuthorization";
import {
  commitImport,
  IMPORT_TEMPLATES,
  parseCsv,
  previewImport,
} from "@/server/admin/importService";
import { listManagedPlaces } from "@/server/admin/managedPlaceService";
import { handleRouteError, jsonOk } from "@/server/http";

const entityTypeSchema = z.enum(["fishing", "partner", "waste", "plogging"]);

export async function GET(request: Request) {
  try {
    await requireAdmin("admin");
    const entityType = entityTypeSchema.parse(
      new URL(request.url).searchParams.get("entityType") ?? "fishing",
    );
    return jsonOk({
      template: IMPORT_TEMPLATES[entityType],
      entityType,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

const bodySchema = z.object({
  entityType: entityTypeSchema,
  format: z.enum(["csv", "json"]),
  content: z.string().min(1).max(2_000_000),
  commit: z.boolean().optional(),
  mode: z.enum(["allValid", "createOnly"]).optional(),
});

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin("admin");
    const body = bodySchema.parse(await request.json());
    let rows: Record<string, unknown>[] = [];
    if (body.format === "csv") {
      rows = parseCsv(body.content);
    } else {
      const parsed = JSON.parse(body.content) as unknown;
      if (!Array.isArray(parsed)) {
        return handleRouteError(new Error("invalidPayload"));
      }
      rows = parsed as Record<string, unknown>[];
    }
    if (rows.length > 500) {
      return handleRouteError(new Error("invalidPayload"));
    }

    if (!body.commit) {
      const existing = await listManagedPlaces(body.entityType);
      const preview = previewImport(
        body.entityType,
        rows,
        new Set(existing.map((item) => item.sourceId)),
      );
      return jsonOk({ preview, total: rows.length });
    }

    const result = await commitImport({
      adminUserId: admin.id,
      entityType: body.entityType,
      rows,
      mode: body.mode ?? "allValid",
    });
    return jsonOk(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
