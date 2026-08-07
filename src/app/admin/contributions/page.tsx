"use client";

import { TextButton } from "@/components/common/IconButton";
import { apiJson } from "@/lib/auth/clientApi";
import { useCallback, useEffect, useState } from "react";

type Contribution = {
  id: string;
  kind: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  note: string | null;
  photoName: string | null;
  status: string;
  voteCount: number;
  adminNote: string | null;
  userId: string | null;
  createdAt: string;
};

export default function AdminContributionsPage() {
  const [items, setItems] = useState<Contribution[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [mileageOnApprove, setMileageOnApprove] = useState(50);

  const refresh = useCallback(async () => {
    const result = await apiJson<{
      contributions: Contribution[];
      mileageOnApprove: number;
    }>("/api/admin/contributions");
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setItems(result.data.contributions);
    setMileageOnApprove(result.data.mileageOnApprove);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  const update = async (
    item: Contribution,
    status: Contribution["status"],
  ) => {
    const adminNote =
      window.prompt("관리자 메모 (선택)", item.adminNote ?? "") ??
      item.adminNote ??
      undefined;
    const result = await apiJson("/api/admin/contributions", {
      method: "PATCH",
      body: JSON.stringify({
        id: item.id,
        status,
        adminNote,
        awardMileage: status === "published",
      }),
    });
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setNotice(
      status === "published"
        ? `게시됨 · 제보자에게 마일리지 ${mileageOnApprove} 적립(해당 시)`
        : "상태가 업데이트되었습니다.",
    );
    void refresh();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">위치 제보 검토</h1>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          쓰레기통은 현장 확인 후 게시, 관광명소·낚시터는 투표·검토 후 게시합니다.
          게시 시 제보자에게 마일리지 {mileageOnApprove}점이 적립됩니다.
        </p>
      </div>

      {notice ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {notice}
        </p>
      ) : null}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ocean-700)]">
                  {item.kind} · {item.status} · 투표 {item.voteCount}
                </p>
                <p className="mt-1 text-sm font-bold">{item.name}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                  {item.address}
                </p>
                <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                  {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                  {item.photoName ? ` · 📷 ${item.photoName}` : ""}
                </p>
                {item.note ? (
                  <p className="mt-2 text-xs">{item.note}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <TextButton
                  variant="secondary"
                  className="h-9 text-xs"
                  onClick={() => void update(item, "reviewing")}
                >
                  검토중
                </TextButton>
                <TextButton
                  variant="primary"
                  className="h-9 text-xs"
                  onClick={() => void update(item, "published")}
                >
                  게시·마일리지
                </TextButton>
                <TextButton
                  variant="ghost"
                  className="h-9 text-xs"
                  onClick={() => void update(item, "rejected")}
                >
                  반려
                </TextButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          대기 중인 제보가 없습니다.
        </p>
      ) : null}
    </div>
  );
}
