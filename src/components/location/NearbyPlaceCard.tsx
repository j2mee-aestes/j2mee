import { Card } from "@/components/common/Card";

interface NearbyPlaceCardProps {
  title: string;
  name: string;
  distanceLabel?: string;
}

export function NearbyPlaceCard({
  title,
  name,
  distanceLabel,
}: NearbyPlaceCardProps) {
  return (
    <Card className="border-dashed bg-[var(--color-surface-muted)] p-3 shadow-none">
      <p className="text-xs font-medium text-[var(--color-text-secondary)]">
        {title}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
        {name}
      </p>
      {distanceLabel ? (
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          {distanceLabel}
        </p>
      ) : null}
    </Card>
  );
}
