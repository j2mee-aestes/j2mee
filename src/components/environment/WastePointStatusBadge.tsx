import { Badge } from "@/components/common/Badge";
import { WASTE_POINT_STATUS_LABELS } from "@/constants/environmentData";
import type { WastePointStatus } from "@/types/environment";

interface WastePointStatusBadgeProps {
  status: WastePointStatus;
}

export function WastePointStatusBadge({ status }: WastePointStatusBadgeProps) {
  const tone =
    status === "available"
      ? "green"
      : status === "temporarilyUnavailable"
        ? "orange"
        : status === "removed"
          ? "gray"
          : "blue";

  return <Badge tone={tone}>{WASTE_POINT_STATUS_LABELS[status]}</Badge>;
}
