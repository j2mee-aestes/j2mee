"use client";

import { hybridActivityRunRepository } from "@/lib/activity/hybridActivityRunRepository";
import { isLocalStorageAvailable } from "@/lib/activity/activityRunStorage";
import type { ActivityRun } from "@/types/activity";
import { useCallback, useEffect, useState } from "react";

export function useActivityRun(activityRunId: string) {
  const [run, setRun] = useState<ActivityRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageOk, setStorageOk] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) {
        return;
      }
      setStorageOk(isLocalStorageAvailable());
      void hybridActivityRunRepository
        .getById(activityRunId)
        .then((found) => {
          if (cancelled) {
            return;
          }
          if (!found) {
            setError(
              "활동 기록을 찾을 수 없습니다. 저장된 일정 목록에서 다시 확인해주세요.",
            );
            setRun(null);
          } else {
            setRun(found);
            setError(null);
          }
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) {
            return;
          }
          setError(
            "일정 정보를 정상적으로 불러오지 못했습니다. 새로운 일정을 만들어주세요.",
          );
          setLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [activityRunId]);

  const persist = useCallback(async (next: ActivityRun) => {
    setRun(next);
    try {
      await hybridActivityRunRepository.save(next);
    } catch {
      setStorageOk(false);
    }
  }, []);

  return {
    run,
    loading,
    error,
    storageOk,
    persist,
    setRun,
  };
}
