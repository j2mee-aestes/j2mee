import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보 안내 | 파도파도",
  description:
    "파도파도가 저장하는 데이터 범위와 삭제·내보내기 방법을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-2xl px-4 py-8 text-sm leading-relaxed text-[var(--color-text-secondary)]"
    >
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
        개인정보 안내
      </h1>
      <p className="mt-3">
        이 안내는 법률 자문이 아니며, 서비스 출시 전 전문가 검토가 필요합니다.
      </p>
      <section className="mt-6 space-y-2">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
          저장되는 정보
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>로그인 계정 기본 정보(이름·이메일·프로필 이미지)</li>
          <li>선호 언어</li>
          <li>즐겨찾기, 일정, 활동 기록 스냅샷</li>
          <li>익명 사용자는 브라우저 localStorage에만 임시 저장</li>
        </ul>
      </section>
      <section className="mt-6 space-y-2">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
          저장하지 않는 정보
        </h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>지속적인 GPS 위치 추적</li>
          <li>현재 위치의 서버 상시 저장</li>
          <li>문의 폼 연락처(현재 서버 저장 대상 아님)</li>
        </ul>
      </section>
      <section className="mt-6 space-y-2">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
          삭제와 내보내기
        </h2>
        <p>
          로그인 사용자는 마이페이지에서 일정·활동·즐겨찾기를 삭제하고 JSON으로
          내보낼 수 있습니다.
        </p>
      </section>
      <p className="mt-8">
        <Link href="/" className="font-medium text-[var(--color-ocean-700)]">
          지도로 돌아가기
        </Link>
      </p>
    </main>
  );
}
