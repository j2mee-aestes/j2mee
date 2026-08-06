interface TideTimeItemProps {
  tide: {
    type: "high" | "low";
    time: string;
    height?: number;
  };
}

export function TideTimeItem({ tide }: TideTimeItemProps) {
  const label = tide.type === "high" ? "만조" : "간조";

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
