import { WASTE_DATA_STALE_DAYS } from "@/constants/environmentData";

/** Returns true when lastVerifiedAt is older than the configured stale threshold (KST calendar days). */
export function isStaleVerificationDate(
  lastVerifiedAt: string | undefined,
  now = new Date(),
): boolean {
  if (!lastVerifiedAt || !/^\d{4}-\d{2}-\d{2}$/.test(lastVerifiedAt)) {
    return true;
  }

  const verified = new Date(`${lastVerifiedAt}T12:00:00+09:00`).getTime();
  const current = now.getTime();
  const diffDays = (current - verified) / (1000 * 60 * 60 * 24);
  return diffDays > WASTE_DATA_STALE_DAYS;
}
