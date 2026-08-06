import { prisma } from "@/server/db";
import { writeAuditLog } from "@/server/admin/auditService";
import { setRecordStatus } from "@/server/admin/managedPlaceService";
import type { ManagedEntityType, ReportStatus, ReportType } from "@/types/admin";

export async function createPlaceReport(input: {
  entityType: ManagedEntityType;
  sourceId: string;
  reportType: ReportType;
  description: string;
  placeNameSnapshot?: string;
}) {
  return prisma.placeReport.create({
    data: {
      entityType: input.entityType,
      sourceId: input.sourceId,
      reportType: input.reportType,
      description: input.description.slice(0, 2000),
      placeNameSnapshot: input.placeNameSnapshot?.slice(0, 200),
      status: "submitted",
    },
  });
}

export async function listPlaceReports(status?: ReportStatus) {
  const rows = await prisma.placeReport.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
  }));
}

export async function updatePlaceReport(input: {
  adminUserId: string;
  id: string;
  status: ReportStatus;
  adminNote?: string;
  deactivatePlace?: boolean;
}) {
  const existing = await prisma.placeReport.findUnique({ where: { id: input.id } });
  if (!existing) {
    throw new Error("notFound");
  }
  const updated = await prisma.placeReport.update({
    where: { id: input.id },
    data: {
      status: input.status,
      adminNote: input.adminNote?.slice(0, 2000),
      resolvedById:
        input.status === "resolved" || input.status === "rejected"
          ? input.adminUserId
          : existing.resolvedById,
      resolvedAt:
        input.status === "resolved" || input.status === "rejected"
          ? new Date()
          : existing.resolvedAt,
    },
  });
  if (input.deactivatePlace) {
    await setRecordStatus({
      adminUserId: input.adminUserId,
      entityType: existing.entityType as ManagedEntityType,
      sourceId: existing.sourceId,
      recordStatus: "inactive",
      reason: `report:${existing.id}`,
    });
  }
  await writeAuditLog({
    adminUserId: input.adminUserId,
    action: "report.update",
    entityType: "report",
    entityId: existing.id,
    before: existing,
    after: updated,
  });
  return updated;
}
