"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/fishing-spots", label: "낚시터" },
  { href: "/admin/partners", label: "수산시장·식당" },
  { href: "/admin/waste-points", label: "수거함" },
  { href: "/admin/plogging-routes", label: "플로깅" },
  { href: "/admin/reports", label: "신고" },
  { href: "/admin/contributions", label: "위치 제보" },
  { href: "/admin/translations", label: "번역 검수" },
  { href: "/admin/import", label: "가져오기" },
  { href: "/admin/system", label: "시스템" },
];

export function AdminShell({
  children,
  email,
}: {
  children: ReactNode;
  email?: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-[var(--color-ocean-800)]">
              파도파도 관리자
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {email ?? "admin"}
            </p>
          </div>
          <div className="flex gap-2 text-sm">
            <Link href="/" className="underline">
              사용자 앱
            </Link>
            <Link href="/my" className="underline">
              마이페이지
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[220px_1fr]">
        <nav
          aria-label="관리자 메뉴"
          className="h-fit rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-2"
        >
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-[var(--radius-md)] px-3 py-2 text-sm ${
                      active
                        ? "bg-[var(--color-ocean-600)] text-white"
                        : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
