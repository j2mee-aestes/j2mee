"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TextButton } from "@/components/common/IconButton";
import { apiJson } from "@/lib/auth/clientApi";
import { useTranslations } from "@/context/LocaleContext";

export type ContributionItem = {
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
  createdAt: string;
};

type ContributionBoardProps = {
  kind?: "attraction" | "fishing" | "bin";
  title?: string;
};

const KIND_LABEL: Record<string, string> = {
  attraction: "관광명소",
  fishing: "낚시터",
  bin: "쓰레기통",
};

export function ContributionBoard({ kind, title }: ContributionBoardProps) {
  const { t } = useTranslations();
  const { status: authStatus } = useSession();
  const [items, setItems] = useState<ContributionItem[]>([]);
  const [threshold, setThreshold] = useState(500);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const query = new URLSearchParams();
    if (kind) query.set("kind", kind);
    const result = await apiJson<{
      contributions: ContributionItem[];
      votePublishThreshold: number;
    }>(`/api/contributions?${query.toString()}`);
    setLoading(false);
    if (!result.ok) {
      setNotice(t("contribute.submitFailed"));
      return;
    }
    setItems(result.data.contributions);
    setThreshold(result.data.votePublishThreshold);
  }, [kind, t]);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
  }, [refresh]);

  const onVote = async (id: string) => {
    setNotice(null);
    if (authStatus !== "authenticated") {
      setNotice(t("contribute.needAuth"));
      return;
    }
    const result = await apiJson("/api/contributions/vote", {
      method: "POST",
      body: JSON.stringify({ contributionId: id }),
    });
    if (!result.ok) {
      setNotice(
        result.error === "ALREADY_VOTED"
          ? t("contribute.alreadyVoted")
          : t("contribute.voteFailed"),
      );
      return;
    }
    setNotice(t("contribute.voteOk"));
    void refresh();
  };

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {title ?? t("contribute.boardTitle")}
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            {t("contribute.voteThreshold", { count: threshold })}
          </p>
        </div>
        <Link
          href="/login"
          className="text-xs font-semibold text-[var(--color-accent-strong)]"
        >
          {authStatus === "authenticated" ? t("auth.myPage") : t("common.login")}
        </Link>
      </div>

      {notice ? (
        <p
          className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
          role="status"
        >
          {notice}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          {t("common.loading")}
        </p>
      ) : items.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-white/60 px-4 py-6 text-sm text-[var(--color-text-secondary)]">
          {t("contribute.boardEmpty")}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const progress = Math.min(100, (item.voteCount / threshold) * 100);
            const canVote =
              item.kind === "attraction" || item.kind === "fishing";
            return (
              <li
                key={item.id}
                className="glass-panel rounded-2xl p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-strong)]">
                      {KIND_LABEL[item.kind] ?? item.kind} · {item.status}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold tracking-tight">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {item.address}
                    </p>
                    {item.note ? (
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        {item.note}
                      </p>
                    ) : null}
                    {item.photoName ? (
                      <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                        📷 {item.photoName}
                      </p>
                    ) : null}
                  </div>
                  {canVote ? (
                    <div className="w-full max-w-[160px] sm:w-auto">
                      <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                        {t("contribute.votesLabel", { count: item.voteCount })}
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-strong))]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <TextButton
                        variant="secondary"
                        className="mt-2 h-9 w-full text-xs"
                        onClick={() => void onVote(item.id)}
                      >
                        {t("contribute.vote")}
                      </TextButton>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {t("contribute.binsReviewOnly")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
