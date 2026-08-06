"use client";

import { TextButton } from "@/components/common/IconButton";
import { apiJson } from "@/lib/auth/clientApi";
import { useCallback, useEffect, useState } from "react";

type Report = {
  id: string;
  entityType: string;
  sourceId: string;
  reportType: string;
  status: string;
  description: string;
  placeNameSnapshot: string | null;
  adminNote: string | null;
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const result = await apiJson<{ reports: Report[] }>("/api/admin/reports");
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setReports(result.data.reports);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  const update = async (
    report: Report,
    status: "reviewing" | "resolved" | "rejected",
    deactivatePlace = false,
  ) => {
    const adminNote =
      window.prompt("관리자 메모 (선택)") ?? report.adminNote ?? undefined;
    const result = await apiJson("/api/admin/reports", {
      method: "PATCH",
      body: JSON.stringify({
        id: report.id,
        status,
        adminNote,
        deactivatePlace,
      }),
    });
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setNotice("신고가 업데이트되었습니다.");
    void refresh();
  };

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-bold">사용자 신고</h1>
      <p className="text-xs text-[var(--color-text-secondary)]">
        연락처는 수집하지 않습니다. 필요 시 대상 장소를 즉시 비활성화할 수 있습니다.
      </p>
      {notice ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
          {notice}
        </p>
      ) : null}
      <ul className="space-y-2">
        {reports.map((report) => (
          <li
            key={report.id}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
          >
            <p className="text-xs text-[var(--color-text-muted)]">
              {report.status} · {report.entityType}/{report.sourceId} ·{" "}
              {report.reportType}
            </p>
            <p className="mt-1 text-sm font-semibold">
              {report.placeNameSnapshot ?? report.sourceId}
            </p>
            <p className="mt-1 text-xs">{report.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <TextButton
                className="h-8 text-xs"
                onClick={() => void update(report, "reviewing")}
              >
                검토 중
              </TextButton>
              <TextButton
                className="h-8 text-xs"
                onClick={() => void update(report, "resolved")}
              >
                해결
              </TextButton>
              <TextButton
                className="h-8 text-xs"
                variant="ghost"
                onClick={() => void update(report, "rejected")}
              >
                반려
              </TextButton>
              <TextButton
                className="h-8 text-xs"
                variant="secondary"
                onClick={() => void update(report, "resolved", true)}
              >
                해결 + 장소 비활성화
              </TextButton>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
