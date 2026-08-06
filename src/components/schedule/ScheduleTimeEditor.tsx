"use client";

/** Thin labeled time/duration editors used by schedule item cards. */
interface ScheduleTimeEditorProps {
  itemId: string;
  startTime?: string;
  durationMinutes: number;
  onStartTimeChange: (time: string) => void;
  onDurationChange: (minutes: number) => void;
}

export function ScheduleTimeEditor({
  itemId,
  startTime,
  durationMinutes,
  onStartTimeChange,
  onDurationChange,
}: ScheduleTimeEditorProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div>
        <label
          htmlFor={`schedule-start-${itemId}`}
          className="mb-1 block text-[11px] font-medium"
        >
          방문 시작시간
        </label>
        <input
          id={`schedule-start-${itemId}`}
          type="time"
          value={startTime ?? ""}
          onChange={(event) => onStartTimeChange(event.target.value)}
          className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-sm"
        />
      </div>
      <div>
        <label
          htmlFor={`schedule-duration-${itemId}`}
          className="mb-1 block text-[11px] font-medium"
        >
          예상 체류시간(분)
        </label>
        <input
          id={`schedule-duration-${itemId}`}
          type="number"
          min={15}
          step={15}
          value={durationMinutes}
          onChange={(event) => onDurationChange(Number(event.target.value))}
          className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-2 text-sm"
        />
      </div>
    </div>
  );
}
