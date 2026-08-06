interface DataSourceInfoProps {
  sourceName?: string;
  lastVerifiedAt?: string;
  sourceUrl?: string;
  isMock?: boolean;
  className?: string;
}

export function DataSourceInfo({
  sourceName,
  lastVerifiedAt,
  sourceUrl,
  isMock = true,
  className = "",
}: DataSourceInfoProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3 text-xs text-[var(--color-text-secondary)] ${className}`}
    >
      <p className="font-semibold text-[var(--color-text-primary)]">데이터 출처</p>
      <p className="mt-1">{sourceName ?? "미상"}</p>
      {isMock ? (
        <p className="mt-1 font-medium text-amber-800">
          현재는 UI 검증용 mock 데이터입니다.
        </p>
      ) : (
        <p className="mt-1">검증된 점포 정보입니다.</p>
      )}
      {lastVerifiedAt ? (
        <p className="mt-0.5">마지막 확인일: {lastVerifiedAt}</p>
      ) : null}
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex font-semibold text-[var(--color-ocean-700)]"
        >
          원문 보기
        </a>
      ) : null}
    </div>
  );
}
