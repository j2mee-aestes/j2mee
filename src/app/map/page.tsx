import { Suspense } from "react";
import { MapAppShell } from "@/components/layout/MapAppShell";

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-text-muted)]">
          지도를 불러오는 중…
        </div>
      }
    >
      <MapAppShell />
    </Suspense>
  );
}
