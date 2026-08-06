"use client";

import { CATEGORY_COLORS } from "@/constants/categories";
import type { PloggingRoute } from "@/types/map";

interface PloggingRouteOverlayProps {
  route: PloggingRoute;
  emphasized?: boolean;
}

export function PloggingRouteOverlay({
  route,
  emphasized = false,
}: PloggingRouteOverlayProps) {
  const points = route.points.map((point) => `${point.x},${point.y}`).join(" ");
  const start = route.points[0];
  const end = route.points[route.points.length - 1];
  const mid = route.points[Math.floor(route.points.length / 2)];

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden={!emphasized}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label={route.name}
      >
        <polyline
          points={points}
          fill="none"
          stroke={CATEGORY_COLORS.plogging}
          strokeWidth={emphasized ? 1.6 : 1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={emphasized ? "0" : "2.2 1.6"}
          opacity={emphasized ? 0.95 : 0.7}
        />
      </svg>

      {start ? (
        <EndpointDot x={start.x} y={start.y} label={route.startLabel} />
      ) : null}
      {end ? <EndpointDot x={end.x} y={end.y} label={route.endLabel} /> : null}

      {mid ? (
        <div
          className="absolute z-[5] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white/95 px-2 py-1 text-[10px] font-semibold text-[var(--color-text-primary)] shadow-sm"
          style={{ left: `${mid.x}%`, top: `${mid.y}%` }}
        >
          {route.distanceKm}km
        </div>
      ) : null}

      {emphasized ? (
        <div className="absolute left-3 top-16 z-20 max-w-[220px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white/95 px-3 py-2 shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-primary)]">
            {route.name}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--color-text-secondary)]">
            {route.distanceKm}km · {route.durationLabel}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function EndpointDot({
  x,
  y,
  label,
}: {
  x: number;
  y: number;
  label: string;
}) {
  return (
    <div
      className="absolute z-[6] -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--color-text-secondary)] shadow-sm">
        {label}
      </span>
      <span
        className="block h-3 w-3 rounded-full border-2 border-white shadow"
        style={{ backgroundColor: CATEGORY_COLORS.plogging }}
      />
    </div>
  );
}
