interface DataSourceInfoProps {
  sourceName?: string;
  lastVerifiedAt?: string;
  sourceUrl?: string;
  /** Unverified entries show a stronger field-check reminder. */
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
        <p className="mt-1">{sourceName ?? "공개 자료 참고"}</p>
      )}
      {isMock ? (
        <p className="mt-1">
          공개 자료를 참고해 정리한 정보입니다. 운영시간·통제 여부 등은 방문
          전 현장 안내를 확인해 주세요.
        </p>
      ) : (
        <p className="mt-1">검증된 정보입니다.</p>
      )}
      <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
        일부 사진은 현장 분위기를 담은 연출 이미지입니다.
      </p>
      {lastVerifiedAt ? (
        <p className="mt-0.5">마지막 확인일: {lastVerifiedAt}</p>
      ) : null}
    </div>
  );
}
