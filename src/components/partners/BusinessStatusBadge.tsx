import { Badge } from "@/components/common/Badge";
import type { BusinessStatus } from "@/types/partner";
import { BUSINESS_STATUS_LABELS } from "@/lib/partners/getBusinessStatus";

const toneByStatus: Record<
  BusinessStatus,
  "green" | "orange" | "gray" | "blue"
> = {
  open: "green",
  closingSoon: "orange",
  closed: "gray",
  unknown: "blue",
};

interface BusinessStatusBadgeProps {
  status: BusinessStatus;
  label?: string;
}

export function BusinessStatusBadge({
  status,
  label,
}: BusinessStatusBadgeProps) {
  return (
    <Badge tone={toneByStatus[status]}>
      {label ?? BUSINESS_STATUS_LABELS[status]}
    </Badge>
  );
}
