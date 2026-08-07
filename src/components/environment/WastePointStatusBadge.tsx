"use client";

import { Badge } from "@/components/common/Badge";
import { useTranslations } from "@/context/LocaleContext";
import type { WastePointStatus } from "@/types/environment";

interface WastePointStatusBadgeProps {
  status: WastePointStatus;
}

export function WastePointStatusBadge({ status }: WastePointStatusBadgeProps) {
  const { t } = useTranslations();
  const tone =
    status === "available"
      ? "green"
      : status === "temporarilyUnavailable"
        ? "orange"
        : status === "removed"
          ? "gray"
          : "blue";

  return (
    <Badge tone={tone}>{t(`environment.wastePointStatus.${status}`)}</Badge>
  );
}
