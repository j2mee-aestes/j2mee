"use client";

import { apiJson } from "@/lib/auth/clientApi";
import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = {
  fishingActive: number;
  fishingRestricted: number;
  unverified: number;
  partners: number;
  waste: number;
  plogging: number;
  openReports: number;
  staleCount: number;
  auditCount: number;
  inactive: number;
};

const CARDS: Array<{ key: keyof Stats; label: string; href: string }> = [
  { key: "fishingActive", label: "활성 낚시터", href: "/admin/fishing-spots" },
  {
    key: "fishingRestricted",
    label: "제한·금지 낚시터",
    href: "/admin/fishing-spots",
  },
  { key: "unverified", label: "미검증 장소", href: "/admin/fishing-spots" },
  { key: "partners", label: "파트너 장소", href: "/admin/partners" },
  { key: "waste", label: "수거함", href: "/admin/waste-points" },
  { key: "plogging", label: "플로깅 코스", href: "/admin/plogging-routes" },
  { key: "openReports", label: "미처리 신고", href: "/admin/reports" },
  { key: "staleCount", label: "오래된 데이터", href: "/admin/system" },
  { key: "inactive", label: "비활성 장소", href: "/admin/fishing-spots" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      void apiJson<{ stats: Stats }>("/api/admin/dashboard").then((result) => {
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setStats(result.data.stats);
      });
    });
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">운영 대시보드</h1>
        <p className="text-xs text-[var(--color-text-secondary)]">
          숫자를 클릭하면 관련 목록으로 이동합니다.
        </p>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {!stats ? (
        <p className="text-sm">불러오는 중…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CARDS.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 hover:border-[var(--color-ocean-400)]"
            >
              <p className="text-xs text-[var(--color-text-secondary)]">
                {card.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--color-ocean-800)]">
                {stats[card.key]}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
