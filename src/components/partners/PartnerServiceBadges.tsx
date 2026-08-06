import { Badge } from "@/components/common/Badge";
import type { PartnerServices } from "@/types/partner";

interface PartnerServiceBadgesProps {
  services: PartnerServices;
  compact?: boolean;
}

const SERVICE_ITEMS: Array<{
  key: keyof PartnerServices;
  label: string;
  tone: "blue" | "teal" | "green" | "orange" | "purple" | "gray";
}> = [
  { key: "seafoodSales", label: "수산물 판매", tone: "orange" },
  { key: "catchCleaning", label: "손질", tone: "teal" },
  { key: "catchCooking", label: "조리", tone: "purple" },
  { key: "outsideCatchAccepted", label: "외부 수산물 접수", tone: "blue" },
  { key: "dineIn", label: "식사", tone: "green" },
  { key: "takeaway", label: "포장", tone: "gray" },
  { key: "reservationAvailable", label: "예약", tone: "blue" },
];

export function PartnerServiceBadges({
  services,
  compact = false,
}: PartnerServiceBadgesProps) {
  const visible = SERVICE_ITEMS.filter((item) => services[item.key]);

  if (visible.length === 0) {
    return (
      <p className="text-xs text-[var(--color-text-muted)]">
        등록된 제공 서비스가 없습니다.
      </p>
    );
  }

  const items = compact
    ? visible.filter((item) =>
        ["catchCleaning", "catchCooking", "outsideCatchAccepted", "seafoodSales"].includes(
          item.key,
        ),
      )
    : visible;

  return (
    <div className="flex flex-wrap gap-1.5" role="list" aria-label="제공 서비스">
      {items.map((item) => (
        <span key={item.key} role="listitem">
          <Badge tone={item.tone}>{item.label} 가능</Badge>
        </span>
      ))}
    </div>
  );
}
