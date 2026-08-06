/** Compare planned HH:mm with current KST time; client-only. */
export function getScheduleDelayMinutes(
  plannedStartTime: string | undefined,
  now = new Date(),
): number | null {
  if (!plannedStartTime || !/^\d{2}:\d{2}$/.test(plannedStartTime)) {
    return null;
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? "0",
  );
  const current = hour * 60 + minute;
  const [ph, pm] = plannedStartTime.split(":").map(Number);
  const planned = ph * 60 + pm;
  return current - planned;
}

export function formatDelayHint(delayMinutes: number | null): string | null {
  if (delayMinutes === null) {
    return null;
  }
  if (delayMinutes >= 10) {
    return `계획보다 약 ${delayMinutes}분 늦게 진행 중입니다.`;
  }
  if (delayMinutes <= -15) {
    return `계획보다 약 ${Math.abs(delayMinutes)}분 이르게 진행 중입니다.`;
  }
  return null;
}
