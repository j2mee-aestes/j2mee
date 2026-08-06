"use client";

import { TextButton } from "@/components/common/IconButton";
import { apiJson } from "@/lib/auth/clientApi";
import type { ManagedEntityType } from "@/types/admin";
import { useState } from "react";

type PreviewRow = {
  id: string;
  action: string;
  errors: string[];
  warnings: string[];
};

export default function AdminImportPage() {
  const [entityType, setEntityType] = useState<ManagedEntityType>("fishing");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadTemplate = async () => {
    const result = await apiJson<{ template: string }>(
      `/api/admin/import?entityType=${entityType}`,
    );
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setFormat("csv");
    setContent(result.data.template);
    setPreview(null);
  };

  const runPreview = async () => {
    const result = await apiJson<{ preview: PreviewRow[]; total: number }>(
      "/api/admin/import",
      {
        method: "POST",
        body: JSON.stringify({
          entityType,
          format,
          content,
          commit: false,
        }),
      },
    );
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setPreview(result.data.preview);
    setNotice(`미리보기 ${result.data.total}행`);
  };

  const commit = async () => {
    const result = await apiJson<{
      blocked: boolean;
      imported?: number;
      updated?: number;
      skipped?: number;
    }>("/api/admin/import", {
      method: "POST",
      body: JSON.stringify({
        entityType,
        format,
        content,
        commit: true,
        mode: "allValid",
      }),
    });
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    if (result.data.blocked) {
      setNotice("치명적 오류가 있어 저장이 차단되었습니다.");
      return;
    }
    setNotice(
      `저장 완료 — 신규 ${result.data.imported}, 수정 ${result.data.updated}, 건너뜀 ${result.data.skipped}`,
    );
  };

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-bold">CSV·JSON 가져오기</h1>
      <p className="text-xs text-[var(--color-text-secondary)]">
        파일을 바로 저장하지 않습니다. 미리보기와 validation 후 확인하세요.
      </p>
      <div className="flex flex-wrap gap-2">
        <select
          value={entityType}
          onChange={(event) =>
            setEntityType(event.target.value as ManagedEntityType)
          }
          className="h-10 rounded-[var(--radius-md)] border px-3 text-sm"
        >
          <option value="fishing">낚시터</option>
          <option value="partner">파트너</option>
          <option value="waste">수거함</option>
          <option value="plogging">플로깅</option>
        </select>
        <select
          value={format}
          onChange={(event) => setFormat(event.target.value as "csv" | "json")}
          className="h-10 rounded-[var(--radius-md)] border px-3 text-sm"
        >
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
        <TextButton onClick={() => void loadTemplate()}>템플릿 불러오기</TextButton>
        <TextButton variant="secondary" onClick={() => void runPreview()}>
          미리보기
        </TextButton>
        <TextButton variant="primary" onClick={() => void commit()}>
          검증 후 저장
        </TextButton>
      </div>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-48 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] p-3 font-mono text-xs"
        aria-label="가져오기 데이터"
      />
      {notice ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
          {notice}
        </p>
      ) : null}
      {preview ? (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border bg-white">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="bg-[var(--color-surface-muted)]">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">동작</th>
                <th className="px-3 py-2">오류</th>
                <th className="px-3 py-2">경고</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((row) => (
                <tr key={`${row.id}-${row.action}`} className="border-t">
                  <td className="px-3 py-2">{row.id}</td>
                  <td className="px-3 py-2">{row.action}</td>
                  <td className="px-3 py-2 text-red-700">
                    {row.errors.join("; ")}
                  </td>
                  <td className="px-3 py-2">{row.warnings.join("; ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
