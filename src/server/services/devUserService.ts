import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";

const DEV_EMAIL = "dev@padopado.local";

/** Creates a local credentials user when AUTH_DEV_PASSWORD is set. */
export async function ensureDevUser() {
  const password = process.env.AUTH_DEV_PASSWORD;
  if (!password) {
    return null;
  }
  const email = (process.env.AUTH_DEV_EMAIL ?? DEV_EMAIL).toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.passwordHash) {
      const passwordHash = await bcrypt.hash(password, 10);
      return prisma.user.update({
        where: { id: existing.id },
        data: { passwordHash },
      });
    }
    return existing;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      name: "파도파도 Dev",
      passwordHash,
      preferredLocale: "ko",
      preference: {
        create: { locale: "ko" },
      },
    },
  });
}
