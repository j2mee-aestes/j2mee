"use client";

import { TextButton } from "@/components/common/IconButton";
import { apiJson } from "@/lib/auth/clientApi";
import type { ManagedEntityType, ManagedPlaceSummary } from "@/types/admin";
import { useCallback, useEffect, useMemo, useState } from "react";

export function PlaceAdminTable({
  entityType,
  title,
}: {
  entityType: ManagedEntityType;
  title: string;
}) {
  const [places, setPlaces] = useState<ManagedPlaceSummary[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await apiJson<{ places: ManagedPlaceSummary[] }>(
      `/api/admin/places?entityType=${entityType}`,
    );
    if (!result.ok) {
      setNotice(result.error);
      setLoading(false);
      return;
    }
    setPlaces(result.data.places);
    setLoading(false);
  }, [entityType]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((place) => {
      if (statusFilter !== "all" && place.recordStatus !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return `${place.name} ${place.sourceId}`.toLowerCase().includes(q);
    });
  }, [places, query, statusFilter]);

  const setStatus = async (
    place: ManagedPlaceSummary,
    recordStatus: "active" | "inactive",
  ) => {
    const reason =
      recordStatus === "inactive"
        ? (window.prompt("비활성화 사유를 입력하세요.") ?? "").trim()
        : "";
    if (recordStatus === "inactive" && !reason) {
      setNotice("비활성화 사유가 필요합니다.");
      return;
    }
    const result = await apiJson("/api/admin/places/status", {
      method: "POST",
      body: JSON.stringify({
        entityType,
        sourceId: place.sourceId,
        recordStatus,
        reason: reason || undefined,
      }),
    });
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setNotice("상태가 변경되었습니다.");
    void refresh();
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">
            노출 상태(recordStatus)와 검증 상태를 관리합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이름·ID 검색"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
            aria-label="검색"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
            aria-label="상태 필터"
          >
            <option value="all">전체 상태</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </div>
      </div>

      {notice ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
          {notice}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm">불러오는 중…</p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr>
                <th className="px-3 py-2">이름</th>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">노출</th>
                <th className="px-3 py-2">검증</th>
                <th className="px-3 py-2">확인일</th>
                <th className="px-3 py-2">작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((place) => (
                <tr key={place.id} className="border-t border-[var(--color-border)]">
                  <td className="px-3 py-2 font-medium">{place.name}</td>
                  <td className="px-3 py-2">{place.sourceId}</td>
                  <td className="px-3 py-2">{place.recordStatus}</td>
                  <td className="px-3 py-2">{place.verificationStatus}</td>
                  <td className="px-3 py-2">{place.lastVerifiedAt ?? "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {place.recordStatus === "active" ? (
                        <TextButton
                          className="h-8 text-xs"
                          variant="ghost"
                          onClick={() => void setStatus(place, "inactive")}
                        >
                          비활성화
                        </TextButton>
                      ) : (
                        <TextButton
                          className="h-8 text-xs"
                          onClick={() => void setStatus(place, "active")}
                        >
                          활성화
                        </TextButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
