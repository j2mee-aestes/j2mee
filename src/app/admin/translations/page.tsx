"use client";

import { TextButton } from "@/components/common/IconButton";
import { apiJson } from "@/lib/auth/clientApi";
import { useEffect, useState } from "react";

type Missing = {
  key: string;
  locale: string;
  koText: string;
  reviewStatus: string;
  isSafety: boolean;
};

export default function AdminTranslationsPage() {
  const [missing, setMissing] = useState<Missing[]>([]);
  const [safetyOnly, setSafetyOnly] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      void apiJson<{ missing: Missing[]; missingCount: number }>(
        "/api/admin/translations",
      ).then((result) => {
        if (!result.ok) {
          setNotice(result.error);
          return;
        }
        setMissing(result.data.missing);
        setNotice(`검수·누락 후보 ${result.data.missingCount}건`);
      });
    });
  }, []);

  const markReviewed = async (item: Missing) => {
    const text =
      window.prompt("검수된 번역문 (현재 메시지 파일 값은 별도 배포 필요)", item.koText) ??
      "";
    if (!text.trim()) return;
    const result = await apiJson("/api/admin/translations", {
      method: "PATCH",
      body: JSON.stringify({
        messageKey: item.key,
        locale: item.locale,
        text,
        reviewStatus: "reviewed",
        isSafety: item.isSafety,
      }),
    });
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setNotice("검수 완료로 기록했습니다.");
  };

  const rows = safetyOnly ? missing.filter((item) => item.isSafety) : missing;

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-bold">번역 검수</h1>
      <p className="text-xs text-[var(--color-text-secondary)]">
        자동번역 API는 사용하지 않습니다. 안전 문구를 우선 검수하세요.
      </p>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={safetyOnly}
          onChange={(event) => setSafetyOnly(event.target.checked)}
        />
        안전 문구만
      </label>
      {notice ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
          {notice}
        </p>
      ) : null}
      <ul className="space-y-2">
        {rows.slice(0, 80).map((item) => (
          <li
            key={`${item.key}:${item.locale}`}
            className="rounded-[var(--radius-md)] border bg-white p-3 text-xs"
          >
            <p className="font-semibold">
              {item.key} · {item.locale} · {item.reviewStatus}
              {item.isSafety ? " · safety" : ""}
            </p>
            <p className="mt-1 text-[var(--color-text-secondary)]">{item.koText}</p>
            <TextButton
              className="mt-2 h-8 text-xs"
              onClick={() => void markReviewed(item)}
            >
              검수 완료 기록
            </TextButton>
          </li>
        ))}
      </ul>
    </section>
  );
}
