import { Badge } from "@/components/common/Badge";

interface LocationFeatureBadgeProps {
  label: string;
  tone?: "blue" | "teal" | "green" | "orange" | "purple" | "gray";
}

export function LocationFeatureBadge({
  label,
  tone = "blue",
}: LocationFeatureBadgeProps) {
  return <Badge tone={tone}>{label}</Badge>;
}
