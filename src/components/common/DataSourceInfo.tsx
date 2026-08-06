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
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-foam)]/80 p-3 text-xs text-[var(--color-text-secondary)] ${className}`}
    >
      <p className="font-semibold text-[var(--color-text-primary)]">데이터 출처</p>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex font-semibold text-[var(--color-accent-strong)] underline-offset-2 hover:underline"
        >
          {sourceName ?? "원문 보기"} →
        </a>
      ) : (
        <p className="mt-1">{sourceName ?? "미상"}</p>
      )}
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
    </div>
  );
}
