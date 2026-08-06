"use client";

import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { PloggingRouteCard } from "@/components/environment/PloggingRouteCard";
import { getAllPloggingRoutes } from "@/lib/environment/ploggingRouteRepository";
import { Footprints } from "lucide-react";
import { useMemo } from "react";

interface PloggingRouteListProps {
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string) => void;
  className?: string;
}

export function PloggingRouteList({
  selectedRouteId,
  onSelectRoute,
  className = "",
}: PloggingRouteListProps) {
  const routes = useMemo(() => getAllPloggingRoutes(), []);

  if (routes.length === 0) {
    return (
      <EmptyState
        title="등록된 플로깅 코스가 없습니다."
        icon={<Footprints className="h-5 w-5" />}
        className={className}
      />
    );
  }

  return (
    <Card className={`flex flex-col gap-3 p-4 ${className}`}>
      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
        플로깅 코스
      </h3>
      <ul className="space-y-2">
        {routes.map((route) => (
          <li key={route.id}>
            <PloggingRouteCard
              route={route}
              selected={selectedRouteId === route.id}
              onSelect={onSelectRoute}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
