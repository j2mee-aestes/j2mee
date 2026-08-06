import { Suspense } from "react";
import { MapAppShell } from "@/components/layout/MapAppShell";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          화면을 불러오는 중…
        </div>
      }
    >
      <MapAppShell />
    </Suspense>
  );
}
