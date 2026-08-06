"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  useDaySchedule,
  type UseDayScheduleResult,
} from "@/hooks/useDaySchedule";

const ScheduleContext = createContext<UseDayScheduleResult | null>(null);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const value = useDaySchedule();
  return (
    <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>
  );
}

export function useScheduleContext(): UseDayScheduleResult {
  const value = useContext(ScheduleContext);
  if (!value) {
    throw new Error("useScheduleContext must be used within ScheduleProvider");
  }
  return value;
}
