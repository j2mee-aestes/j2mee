"use client";

import { LocaleProvider } from "@/context/LocaleContext";
import { ScheduleProvider } from "@/context/ScheduleContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ScheduleProvider>{children}</ScheduleProvider>
    </LocaleProvider>
  );
}
