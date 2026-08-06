import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/server/admin/adminAuthorization";

export const metadata: Metadata = {
  title: "관리자 | 파도파도",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let email: string | null = null;
  try {
    const admin = await requireAdmin("admin");
    email = admin.email;
  } catch {
    redirect("/login?callbackUrl=%2Fadmin");
  }

  return <AdminShell email={email}>{children}</AdminShell>;
}
