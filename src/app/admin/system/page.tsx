"use client";

import { apiJson } from "@/lib/auth/clientApi";
import { useEffect, useState } from "react";

export default function AdminSystemPage() {
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [logs, setLogs] = useState<
    Array<{
      id: string;
      action: string;
      entityType: string;
      entityId?: string | null;
      adminEmail?: string | null;
      createdAt: string;
    }>
  >([]);

  useEffect(() => {
    queueMicrotask(() => {
      void apiJson<{ status: Record<string, unknown> }>("/api/admin/system").then(
        (result) => {
          if (result.ok) setStatus(result.data.status);
        },
      );
      void apiJson<{ logs: typeof logs }>("/api/admin/audit?limit=30").then(
        (result) => {
          if (result.ok) setLogs(result.data.logs);
        },
      );
    });
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">시스템·API 상태</h1>
        <p className="text-xs text-[var(--color-text-secondary)]">
          비밀 키 값은 표시하지 않습니다. 조석(물때) 기능은 제거되었습니다.
        </p>
      </div>
      <pre className="overflow-x-auto rounded-[var(--radius-lg)] border bg-white p-4 text-xs">
        {status ? JSON.stringify(status, null, 2) : "불러오는 중…"}
      </pre>
      <div>
        <h2 className="text-sm font-bold">최근 audit log</h2>
        <ul className="mt-2 space-y-2">
          {logs.map((log) => (
            <li
              key={log.id}
              className="rounded-md border bg-white px-3 py-2 text-xs"
            >
              {log.createdAt} · {log.adminEmail} · {log.action} ·{" "}
              {log.entityType}/{log.entityId ?? "-"}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
