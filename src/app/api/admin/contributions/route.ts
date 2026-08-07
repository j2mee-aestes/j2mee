import { requireAdmin } from "@/server/admin/adminAuthorization";
import { prisma } from "@/server/db";
import { handleRouteError, jsonError, jsonOk } from "@/server/http";
import { z } from "zod";

const MILEAGE_ON_APPROVE = 50;
const VOTE_PUBLISH_THRESHOLD = 500;

export async function GET() {
  try {
    await requireAdmin("admin");
    const contributions = await prisma.placeContribution.findMany({
      orderBy: [{ status: "asc" }, { voteCount: "desc" }, { createdAt: "desc" }],
      take: 200,
    });
    return jsonOk({
      contributions,
      votePublishThreshold: VOTE_PUBLISH_THRESHOLD,
      mileageOnApprove: MILEAGE_ON_APPROVE,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum([
    "submitted",
    "reviewing",
    "ready_for_publish",
    "published",
    "rejected",
  ]),
  adminNote: z.string().max(2000).optional(),
  awardMileage: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin("admin");
    const body = patchSchema.parse(await request.json());
    const existing = await prisma.placeContribution.findUnique({
      where: { id: body.id },
    });
    if (!existing) {
      return jsonError("NOT_FOUND", 404);
    }

    const updated = await prisma.placeContribution.update({
      where: { id: body.id },
      data: {
        status: body.status,
        adminNote: body.adminNote ?? existing.adminNote,
        publishedAt:
          body.status === "published" ? new Date() : existing.publishedAt,
      },
    });

    const shouldAward =
      body.awardMileage !== false &&
      body.status === "published" &&
      existing.status !== "published" &&
      Boolean(existing.userId);

    if (shouldAward && existing.userId) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: existing.userId },
          data: { mileageBalance: { increment: MILEAGE_ON_APPROVE } },
        }),
        prisma.mileageLedger.create({
          data: {
            userId: existing.userId,
            delta: MILEAGE_ON_APPROVE,
            reason: "contribution_published",
            refType: "PlaceContribution",
            refId: existing.id,
          },
        }),
      ]);
    }

    return jsonOk({
      contribution: updated,
      mileageAwarded: shouldAward,
      reviewedBy: admin.email,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
