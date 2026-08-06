import { prisma } from "@/server/db";

export async function writeAuditLog(input: {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
}) {
  return prisma.auditLog.create({
    data: {
      adminUserId: input.adminUserId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      beforeJson: input.before === undefined ? null : JSON.stringify(input.before),
      afterJson: input.after === undefined ? null : JSON.stringify(input.after),
    },
  });
}

export async function listAuditLogs(limit = 50) {
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 200),
    include: {
      admin: { select: { email: true, name: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    adminUserId: row.adminUserId,
    adminEmail: row.admin.email,
    adminName: row.admin.name,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    before: row.beforeJson ? JSON.parse(row.beforeJson) : null,
    after: row.afterJson ? JSON.parse(row.afterJson) : null,
    createdAt: row.createdAt.toISOString(),
  }));
}
