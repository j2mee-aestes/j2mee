import { formatDistanceKm } from "@/lib/geo/calculateDistance";
import { buildCompletionSummary } from "@/lib/activity/buildCompletionSummary";
import type { ActivityRun } from "@/types/activity";

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
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateStr}T12:00:00+09:00`));
}

export function formatActivityShareText(run: ActivityRun): string {
  const summary = buildCompletionSummary(run);
  const lines = [
    `[파도파도 활동 기록]`,
    ``,
    `날짜: ${formatKoreanDate(summary.date)}`,
    `일정: ${summary.title}`,
    ``,
    `완료한 장소`,
  ];

  summary.visitedPlaces
    .filter((place) => place.status === "completed")
    .forEach((place, index) => {
      lines.push(`${index + 1}. ${place.title}`);
    });

  lines.push(``);
  lines.push(
    `계획 거리: ${formatDistanceKm(summary.plannedDistanceKm)} (참고)`,
  );
  lines.push(
    `계획 시간: ${formatDuration(summary.plannedDurationMinutes)}`,
  );

  if (summary.ploggingSummary) {
    lines.push(``);
    lines.push(`플로깅`);
    summary.ploggingSummary.routeTitles.forEach((title) => {
      lines.push(`- 코스: ${title}`);
    });
    lines.push(`- 수거 봉투: ${summary.ploggingSummary.totalBagCount}개`);
    if (summary.ploggingSummary.disposalPointNames.length > 0) {
      lines.push(
        `- 배출 장소: ${summary.ploggingSummary.disposalPointNames.join(", ")}`,
      );
    }
  }

  lines.push(``);
  lines.push(
    `※ 거리와 시간은 일정에 등록된 예상값이며, 실제 GPS 이동기록은 측정되지 않았습니다.`,
  );

  return lines.join("\n");
}
