import { prisma } from "@/server/db";
import { writeAuditLog } from "@/server/admin/auditService";
import { ensureCatalogSeeded } from "@/server/admin/catalogSeed";
import type { ManagedEntityType, RecordStatus } from "@/types/admin";

function rowToSummary(row: {
  id: string;
  entityType: string;
  sourceId: string;
  recordStatus: string;
  verificationStatus: string;
  name: string;
  lastVerifiedAt: string | null;
  updatedAt: Date;
  payload: string;
}) {
  return {
    id: row.id,
    entityType: row.entityType as ManagedEntityType,
    sourceId: row.sourceId,
    recordStatus: row.recordStatus as RecordStatus,
    verificationStatus: row.verificationStatus,
    name: row.name,
    lastVerifiedAt: row.lastVerifiedAt,
    updatedAt: row.updatedAt.toISOString(),
    payload: JSON.parse(row.payload) as Record<string, unknown>,
  };
}

export async function listManagedPlaces(entityType?: ManagedEntityType) {
  await ensureCatalogSeeded();
  const rows = await prisma.managedPlace.findMany({
    where: entityType ? { entityType } : undefined,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(rowToSummary);
}

export async function getManagedPlace(
  entityType: ManagedEntityType,
  sourceId: string,
) {
  await ensureCatalogSeeded();
  const row = await prisma.managedPlace.findUnique({
    where: {
      entityType_sourceId: { entityType, sourceId },
    },
  });
  return row ? rowToSummary(row) : null;
}

export async function upsertManagedPlace(input: {
  adminUserId: string;
  entityType: ManagedEntityType;
  sourceId: string;
  name: string;
  recordStatus: RecordStatus;
  verificationStatus: string;
  lastVerifiedAt?: string | null;
  payload: Record<string, unknown>;
  changeReason?: string;
}) {
  await ensureCatalogSeeded();
  const existing = await prisma.managedPlace.findUnique({
    where: {
      entityType_sourceId: {
        entityType: input.entityType,
        sourceId: input.sourceId,
      },
    },
  });
  const payload = {
    ...input.payload,
    id: input.sourceId,
    name: input.name,
    recordStatus: input.recordStatus,
    verificationStatus: input.verificationStatus,
    lastVerifiedAt: input.lastVerifiedAt ?? null,
    ...(input.changeReason ? { changeReason: input.changeReason } : {}),
  };
  const row = await prisma.managedPlace.upsert({
    where: {
      entityType_sourceId: {
        entityType: input.entityType,
        sourceId: input.sourceId,
      },
    },
    create: {
      entityType: input.entityType,
      sourceId: input.sourceId,
      name: input.name,
      recordStatus: input.recordStatus,
      verificationStatus: input.verificationStatus,
      lastVerifiedAt: input.lastVerifiedAt ?? null,
      payload: JSON.stringify(payload),
    },
    update: {
      name: input.name,
      recordStatus: input.recordStatus,
      verificationStatus: input.verificationStatus,
      lastVerifiedAt: input.lastVerifiedAt ?? null,
      payload: JSON.stringify(payload),
    },
  });
  await writeAuditLog({
    adminUserId: input.adminUserId,
    action: existing ? "update" : "create",
    entityType: input.entityType,
    entityId: input.sourceId,
    before: existing ? JSON.parse(existing.payload) : null,
    after: payload,
  });
  return rowToSummary(row);
}

export async function setRecordStatus(input: {
  adminUserId: string;
  entityType: ManagedEntityType;
  sourceId: string;
  recordStatus: RecordStatus;
  reason?: string;
}) {
  const existing = await getManagedPlace(input.entityType, input.sourceId);
  if (!existing) {
    throw new Error("notFound");
  }
  return upsertManagedPlace({
    adminUserId: input.adminUserId,
    entityType: input.entityType,
    sourceId: input.sourceId,
    name: existing.name,
    recordStatus: input.recordStatus,
    verificationStatus: existing.verificationStatus,
    lastVerifiedAt: existing.lastVerifiedAt,
    payload: {
      ...existing.payload,
      recordStatus: input.recordStatus,
      statusChangeReason: input.reason ?? null,
    },
    changeReason: input.reason,
  });
}

export async function listInactiveSourceIds() {
  await ensureCatalogSeeded();
  const rows = await prisma.managedPlace.findMany({
    where: { recordStatus: { in: ["inactive", "archived", "draft"] } },
    select: { entityType: true, sourceId: true },
  });
  return rows;
}

export async function dashboardStats() {
  await ensureCatalogSeeded();
  const [places, reports, audits] = await Promise.all([
    prisma.managedPlace.findMany(),
    prisma.placeReport.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.auditLog.count(),
  ]);

  const fishing = places.filter((p) => p.entityType === "fishing");
  const staleCutoff = Date.now() - 180 * 24 * 60 * 60 * 1000;
  const stale = places.filter((p) => {
    if (!p.lastVerifiedAt) return true;
    const t = Date.parse(p.lastVerifiedAt);
    return Number.isNaN(t) || t < staleCutoff;
  });

  const openReports =
    (reports.find((r) => r.status === "submitted")?._count ?? 0) +
    (reports.find((r) => r.status === "reviewing")?._count ?? 0);

  return {
    fishingActive: fishing.filter((p) => p.recordStatus === "active").length,
    fishingRestricted: fishing.filter((p) => {
      const payload = JSON.parse(p.payload) as { fishingAllowedStatus?: string };
      return (
        payload.fishingAllowedStatus === "restricted" ||
        payload.fishingAllowedStatus === "prohibited"
      );
    }).length,
    unverified: places.filter((p) => p.verificationStatus === "unverified")
      .length,
    partners: places.filter((p) => p.entityType === "partner").length,
    waste: places.filter((p) => p.entityType === "waste").length,
    plogging: places.filter((p) => p.entityType === "plogging").length,
    openReports,
    staleCount: stale.length,
    auditCount: audits,
    inactive: places.filter((p) => p.recordStatus === "inactive").length,
  };
}
