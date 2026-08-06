"use client";

import { ScheduleProvider } from "@/context/ScheduleContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return <ScheduleProvider>{children}</ScheduleProvider>;
}
