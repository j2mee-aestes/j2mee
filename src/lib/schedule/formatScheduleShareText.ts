import { SCHEDULE_TYPE_LABELS } from "@/constants/scheduleDefaults";
import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import type { DaySchedule } from "@/types/schedule";

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) {
    return `${minutes}분`;
  }
  if (minutes === 0) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${minutes}분`;
}

function formatKoreanDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00+09:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatScheduleShareText(schedule: DaySchedule): string {
  const lines = [
    `[파도파도 일정]`,
    ``,
    `제목: ${schedule.title}`,
    `날짜: ${formatKoreanDate(schedule.date)}`,
    ``,
  ];

  const ordered = [...schedule.items].sort((a, b) => a.order - b.order);
  ordered.forEach((item, index) => {
    const time = item.startTime ? `${item.startTime} ` : "";
    lines.push(
      `${index + 1}. ${time}${item.title} (${SCHEDULE_TYPE_LABELS[item.type]})`,
    );
  });

  lines.push(``);
  lines.push(`예상 거리: ${formatDistanceKm(schedule.totalDistanceKm)} (참고)`);
  lines.push(`예상 소요시간: ${formatDuration(schedule.totalDurationMinutes)}`);
  lines.push(``);
  lines.push(
    `※ 이동거리는 좌표 기준 참고값이며, 교통 상황을 반영하지 않습니다.`,
  );
  lines.push(`※ 방문 가능 여부를 보장하지 않습니다. 현장 안내를 우선하세요.`);

  return lines.join("\n");
}
