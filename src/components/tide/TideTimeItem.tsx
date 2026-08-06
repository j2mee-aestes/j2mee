import type { TideTime } from "@/types/fishing";
import { UI_TEXT } from "@/constants/uiText";

interface TideTimeItemProps {
  tide: TideTime;
}

export function TideTimeItem({ tide }: TideTimeItemProps) {
  const label = tide.type === "high" ? UI_TEXT.highTide : UI_TEXT.lowTide;

  return (
    <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-2">
      <p className="text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </p>
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
        {tide.time}
        {tide.height !== undefined ? (
          <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
            {tide.height}cm
          </span>
        ) : null}
      </p>
    </li>
  );
}
