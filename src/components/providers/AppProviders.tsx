"use client";

import { AppErrorBoundary } from "@/components/common/AppErrorBoundary";
import { SkipLink } from "@/components/common/SkipLink";
import { KakaoMapsPreload } from "@/components/map/KakaoMapsPreload";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { LocaleProvider } from "@/context/LocaleContext";
import { ScheduleProvider } from "@/context/ScheduleContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <AppErrorBoundary>
          <SkipLink />
          <KakaoMapsPreload />
          <ScheduleProvider>
            <div id="main-content">{children}</div>
          </ScheduleProvider>
        </AppErrorBoundary>
      </LocaleProvider>
    </SessionProvider>
  );
}
