"use client";

import { SessionProvider } from "@/components/providers/SessionProvider";
import { LocaleProvider } from "@/context/LocaleContext";
import { ScheduleProvider } from "@/context/ScheduleContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <ScheduleProvider>{children}</ScheduleProvider>
      </LocaleProvider>
    </SessionProvider>
  );
}
