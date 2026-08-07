"use client";

import { Badge } from "@/components/common/Badge";
import { useTranslations } from "@/context/LocaleContext";
import type { WastePointType } from "@/types/environment";

interface WastePointTypeBadgeProps {
  type: WastePointType;
}

export function WastePointTypeBadge({ type }: WastePointTypeBadgeProps) {
  const { t } = useTranslations();
  const tone =
    type === "fishingLine" || type === "fishingGear"
      ? "teal"
      : type === "recycling"
        ? "green"
        : type === "ploggingCollection"
          ? "blue"
          : "gray";

  return (
    <Badge tone={tone}>{t(`environment.wastePointType.${type}`)}</Badge>
  );
}
