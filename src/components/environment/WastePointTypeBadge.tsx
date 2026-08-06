import { Badge } from "@/components/common/Badge";
import { WASTE_POINT_TYPE_LABELS } from "@/constants/environmentData";
import type { WastePointType } from "@/types/environment";

interface WastePointTypeBadgeProps {
  type: WastePointType;
}

export function WastePointTypeBadge({ type }: WastePointTypeBadgeProps) {
  const tone =
    type === "fishingLine" || type === "fishingGear"
      ? "teal"
      : type === "recycling"
        ? "green"
        : type === "ploggingCollection"
          ? "blue"
          : "gray";

  return <Badge tone={tone}>{WASTE_POINT_TYPE_LABELS[type]}</Badge>;
}
