import { auth } from "@/auth";
import { prisma } from "@/server/db";
import type { UserRole } from "@/types/admin";
import { AuthError } from "@/server/auth/requireUser";

const ROLE_RANK: Record<UserRole, number> = {
  user: 0,
  admin: 1,
  superAdmin: 2,
};

export function normalizeRole(value: unknown): UserRole {
  if (value === "admin" || value === "superAdmin" || value === "user") {
    return value;
  }
  return "user";
}

export function hasMinRole(role: UserRole, minimum: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

/** Promote emails listed in INITIAL_ADMIN_EMAILS to admin once. */
export async function ensureInitialAdmins() {
  const raw = process.env.INITIAL_ADMIN_EMAILS ?? "";
  const emails = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (emails.length === 0) {
    return;
  }
  await prisma.user.updateMany({
    where: {
      email: { in: emails },
      role: "user",
    },
    data: { role: "admin" },
  });
}

export async function requireAdmin(minimum: UserRole = "admin") {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new AuthError("loginRequired", 401);
  }
  await ensureInitialAdmins();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true },
  });
  if (!user) {
    throw new AuthError("loginRequired", 401);
  }
  const role = normalizeRole(user.role);
  if (!hasMinRole(role, minimum)) {
    throw new AuthError("forbidden", 403);
  }
  return { ...user, role };
}
