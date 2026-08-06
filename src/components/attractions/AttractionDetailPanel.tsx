"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { PlaceImageGallery } from "@/components/common/PlaceImageGallery";
import { TextButton } from "@/components/common/IconButton";
import { DataSourceInfo } from "@/components/common/DataSourceInfo";
import { useTranslations } from "@/context/LocaleContext";
import type { AttractionPlace } from "@/types/attraction";

type AttractionDetailPanelProps = {
  attraction: AttractionPlace;
  className?: string;
};

export function AttractionDetailPanel({
  attraction,
  className = "",
}: AttractionDetailPanelProps) {
  const { t } = useTranslations();
  const [show3d, setShow3d] = useState(false);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Card as="article" className="flex flex-col gap-4 p-4">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ca8a04]">
            {t("attraction.title")}
          </p>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {attraction.name}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {attraction.address}
          </p>
          {attraction.description ? (
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {attraction.description}
            </p>
          ) : null}
        </div>

        <PlaceImageGallery
          images={attraction.imageUrls}
          alt={attraction.name}
          pendingLabel={t("fishing.imagePending")}
        />

        {attraction.highlights && attraction.highlights.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold">{t("attraction.highlights")}</h3>
            <ul className="mt-1 space-y-1 text-xs text-[var(--color-text-secondary)]">
              {attraction.highlights.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {typeof attraction.voteCount === "number" ? (
          <p className="text-xs text-[var(--color-text-muted)]">
            {t("attraction.votes", { count: attraction.voteCount })}
          </p>
        ) : null}

        <TextButton variant="primary" onClick={() => setShow3d(true)}>
          {t("attraction.view3d")}
        </TextButton>

        <DataSourceInfo
          sourceName={attraction.sourceName}
          sourceUrl={attraction.sourceUrl}
          lastVerifiedAt={attraction.lastVerifiedAt}
          isMock={attraction.verificationStatus === "unverified"}
        />
      </Card>

      {show3d ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShow3d(false)}
        >
          <div
            className="ui-rise w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-[linear-gradient(160deg,#0b3d5c,#1aa6c4)] p-4 text-white shadow-[var(--shadow-float)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold">
                {attraction.name} · 3D
              </h3>
              <TextButton
                variant="secondary"
                className="!text-[var(--color-ink)]"
                onClick={() => setShow3d(false)}
              >
                {t("attraction.close3d")}
              </TextButton>
            </div>
            <div className="relative mt-4 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-black/20">
              <div
                className="h-28 w-28 animate-[spin_12s_linear_infinite] rounded-[2rem] bg-[conic-gradient(from_120deg,#fff8,#7ec8e3,#0b9bb8,#fff4)] opacity-90 shadow-[0_0_40px_rgba(126,200,227,0.45)]"
                aria-hidden
              />
              <p className="absolute bottom-3 left-3 right-3 text-center text-[11px] text-white/85">
                {attraction.model3dUrl
                  ? `모델: ${attraction.model3dUrl}`
                  : "3D 미리보기 (실제 glb 연동 전 플레이스홀더)"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
