import { z } from "zod";
import { createPlaceReport } from "@/server/admin/reportService";
import { handleRouteError, jsonOk } from "@/server/http";

const schema = z.object({
  entityType: z.enum(["fishing", "partner", "waste", "plogging"]),
  sourceId: z.string().min(1).max(120),
  reportType: z.enum([
    "locationError",
    "facilityRemoved",
    "facilityMissing",
    "binFull",
    "unavailable",
    "routeHazard",
    "accessRestricted",
    "other",
  ]),
  description: z.string().min(3).max(2000),
  placeNameSnapshot: z.string().max(200).optional(),
});

/** Public report endpoint — no contact info collected. */
export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const report = await createPlaceReport(body);
    return jsonOk({ id: report.id }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
