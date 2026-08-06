import Link from "next/link";
import { Binoculars, Fish, Trash2 } from "lucide-react";

const ITEMS = [
  {
    href: "/contribute/bins",
    icon: Trash2,
    title: "쓰레기통 제보",
    body: "사진과 위치정보로 수거함 위치를 알려 주세요. 검토 후 지도에 반영됩니다.",
  },
  {
    href: "/contribute/attractions",
    icon: Binoculars,
    title: "관광명소 제보",
    body: "새로운 명소를 올리고 투표를 모읍니다. 500표 이상이면 공식 반영을 검토합니다.",
  },
  {
    href: "/contribute/fishing",
    icon: Fish,
    title: "낚시터 제보",
    body: "낚시 포인트 후보를 올리고 커뮤니티 투표를 받습니다. 500표 기준을 적용합니다.",
  },
];

export default function ContributePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm font-semibold text-[var(--color-accent-strong)]"
      >
        ← 홈으로
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        위치 제보
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        현장에서 확인한 장소를 제보해 주세요. 개발자 검토 후 웹 지도에 반영되며,
        반영되면 마일리지가 적립됩니다. (추후 네이버 포인트 등 교환 예정)
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="glass-panel flex items-start gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">
                  {item.body}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-[var(--color-text-muted)]">
        공식 반영 기준: 투표 500표 · 로그인 후 제보·투표가 가능합니다.
      </p>
    </main>
  );
}
