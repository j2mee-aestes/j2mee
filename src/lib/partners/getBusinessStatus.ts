import type { BusinessHours, BusinessStatus } from "@/types/partner";

const DAY_KEYS: BusinessHours["day"][] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DAY_LABELS: Record<BusinessHours["day"], string> = {
  monday: "월",
  tuesday: "화",
  wednesday: "수",
  thursday: "목",
  friday: "금",
  saturday: "토",
  sunday: "일",
};

export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  open: "영업 중",
  closingSoon: "곧 영업 종료",
  closed: "영업 종료",
  unknown: "확인 필요",
};

function parseHm(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Evaluate open/closed status using Asia/Seoul local time. */
export function getBusinessStatus(
  hours: BusinessHours[] | undefined,
  now = new Date(),
): { status: BusinessStatus; label: string; todayHoursLabel: string } {
  if (!hours || hours.length === 0) {
    return {
      status: "unknown",
      label: BUSINESS_STATUS_LABELS.unknown,
      todayHoursLabel: "영업시간 정보가 없습니다.",
    };
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? "0",
  );
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    weekday,
  );
  const dayKey = DAY_KEYS[weekdayIndex === -1 ? 1 : weekdayIndex];
  const today = hours.find((item) => item.day === dayKey);

  if (!today || today.isClosed || !today.openTime || !today.closeTime) {
    return {
      status: "closed",
      label: BUSINESS_STATUS_LABELS.closed,
      todayHoursLabel: `${DAY_LABELS[dayKey]} 휴무`,
    };
  }

  const open = parseHm(today.openTime);
  const close = parseHm(today.closeTime);
  const current = hour * 60 + minute;

  if (open === null || close === null) {
    return {
      status: "unknown",
      label: BUSINESS_STATUS_LABELS.unknown,
      todayHoursLabel: `${DAY_LABELS[dayKey]} ${today.openTime}–${today.closeTime}`,
    };
  }

  const todayHoursLabel = `${DAY_LABELS[dayKey]} ${today.openTime}–${today.closeTime}`;

  if (current < open || current >= close) {
    return {
      status: "closed",
      label: BUSINESS_STATUS_LABELS.closed,
      todayHoursLabel,
    };
  }

  if (close - current <= 60) {
    return {
      status: "closingSoon",
      label: BUSINESS_STATUS_LABELS.closingSoon,
      todayHoursLabel,
    };
  }

  return {
    status: "open",
    label: BUSINESS_STATUS_LABELS.open,
    todayHoursLabel,
  };
}
