"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "@/context/LocaleContext";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import {
  AudioLines,
  Camera,
  Fish,
  Footprints,
  Map as MapIcon,
  MapPin,
  Pause,
  Play,
  Sailboat,
  ShoppingBasket,
  Trash2,
  UserRound,
  Waves,
} from "lucide-react";

const NAV = [
  { href: "/map", labelKey: "home.nav.map" as const, id: "map" },
  {
    href: "/contribute",
    labelKey: "home.nav.contribute" as const,
    id: "contribute",
  },
  { href: "/sources", labelKey: "home.nav.data" as const, id: "data" },
  {
    href: "/map?category=attraction",
    labelKey: "home.nav.tourism" as const,
    id: "tourism",
  },
  { href: "/login", labelKey: "home.nav.login" as const, id: "login" },
];

const SLIDE_DURATION_MS = 8000;

type SlideId = "brand" | "features" | "services" | "insights";

const SLIDES: SlideId[] = ["brand", "features", "services", "insights"];

function FeatureMiniCard({
  href,
  icon,
  title,
  body,
  tone,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  body: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#d7e4f0] bg-white/95 shadow-[0_10px_30px_-20px_rgba(11,36,71,0.35)] transition hover:-translate-y-0.5"
    >
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <span
          className="grid h-8 w-8 place-items-center rounded-full"
          style={{ background: `${tone}18`, color: tone }}
        >
          {icon}
        </span>
        <p className="mt-2 text-sm font-bold text-[#0b2447]">{title}</p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#5b738a]">
          {body}
        </p>
      </div>
      <div
        className="h-16 border-t border-[#e8f0f7] sm:h-[4.5rem]"
        style={{
          background: `linear-gradient(145deg, ${tone}22, #f4f8fc 55%, ${tone}33)`,
        }}
        aria-hidden
      />
    </Link>
  );
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/25 bg-white/15 px-3 py-2.5 text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.55)] backdrop-blur-md">
      <div className="flex items-center gap-2 text-[11px] text-white/85">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 font-display text-lg font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

export function LandingHome() {
  const { t } = useTranslations();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [activeNav, setActiveNav] = useState("map");

  const slideId = SLIDES[slideIndex];

  const togglePlay = useCallback(() => {
    setPlaying((value) => !value);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      const ratio = Math.min(1, elapsed / SLIDE_DURATION_MS);
      setSlideProgress(ratio * 100);
      if (ratio >= 1) {
        setSlideIndex((index) => (index + 1) % SLIDES.length);
        setSlideProgress(0);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, slideIndex]);

  const totalProgress =
    ((slideIndex + slideProgress / 100) / SLIDES.length) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden text-[#0b2447]">
      {/* Full-bleed ocean plane */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/ocean-bg.jpg)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(232,244,252,0.35)_0%,rgba(180,214,235,0.2)_40%,rgba(10,40,70,0.25)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
        {/* Top chrome */}
        <header className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0b2447] text-white shadow-[0_10px_24px_-12px_rgba(11,36,71,0.8)]">
              <Waves className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-display text-xl font-bold tracking-[-0.04em] text-[#0b2447] sm:text-2xl">
              {t("common.serviceName")}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector variant="pill" />
            <Link
              href="/map"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#0b2447] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(11,36,71,0.75)] transition hover:-translate-y-0.5"
            >
              {t("home.cta.openMap")}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </header>

        {/* Central video stage */}
        <section className="relative flex min-h-0 flex-1 flex-col">
          <div className="relative flex min-h-[72vh] flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-white/55 bg-white/88 shadow-[0_30px_80px_-28px_rgba(8,30,55,0.55)] backdrop-blur-xl sm:rounded-[2.25rem] lg:min-h-[78vh]">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="/videos/ocean-hero.mp4"
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-label={t("home.hero.mediaLabel")}
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,28,52,0.28)_0%,rgba(8,28,52,0.45)_45%,rgba(8,28,52,0.72)_100%)]"
                aria-hidden
              />

              {/* Slide overlays */}
              <div className="relative z-10 flex h-full flex-col px-4 pb-28 pt-6 sm:px-7 sm:pb-32 sm:pt-8 lg:px-10">
                {slideId === "brand" ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center text-white">
                    <p className="font-[family-name:var(--font-outfit)] text-[clamp(2.8rem,8vw,5.2rem)] font-semibold leading-none tracking-[-0.05em]">
                      {t("common.serviceName")}
                    </p>
                    <p className="mt-4 max-w-xl text-sm text-white/90 sm:text-base">
                      {t("home.slides.brand.sub")}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        href="/map"
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#0b2447]"
                      >
                        <MapIcon className="h-4 w-4" aria-hidden />
                        {t("home.cta.exploreMap")}
                      </Link>
                      <Link
                        href="/contribute"
                        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/50 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md"
                      >
                        <MapPin className="h-4 w-4" aria-hidden />
                        {t("home.cta.contribute")}
                      </Link>
                    </div>
                    <div className="pointer-events-none mt-10 flex flex-wrap justify-center gap-3 opacity-90">
                      {[Camera, Fish, Sailboat, MapPin, Trash2].map(
                        (Icon, index) => (
                          <span
                            key={index}
                            className="grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-white/15 backdrop-blur-md"
                          >
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                ) : null}

                {slideId === "features" ? (
                  <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
                    <div className="flex flex-col justify-center text-white">
                      <h1 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
                        {t("home.slides.features.title")}
                      </h1>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                        {t("home.slides.features.body")}
                      </p>
                    </div>
                    <div className="grid min-h-0 grid-cols-2 gap-2.5 sm:gap-3">
                      <FeatureMiniCard
                        href="/map?category=fishing"
                        icon={<Fish className="h-4 w-4" />}
                        title={t("home.features.fishing.title")}
                        body={t("home.features.fishing.body")}
                        tone="#0284c7"
                      />
                      <FeatureMiniCard
                        href="/map?category=market"
                        icon={<ShoppingBasket className="h-4 w-4" />}
                        title={t("home.features.market.title")}
                        body={t("home.features.market.body")}
                        tone="#ea580c"
                      />
                      <FeatureMiniCard
                        href="/map?category=trash"
                        icon={<Trash2 className="h-4 w-4" />}
                        title={t("home.features.bins.title")}
                        body={t("home.features.bins.body")}
                        tone="#16a34a"
                      />
                      <FeatureMiniCard
                        href="/map?category=plogging"
                        icon={<Footprints className="h-4 w-4" />}
                        title={t("home.features.plogging.title")}
                        body={t("home.features.plogging.body")}
                        tone="#0d9488"
                      />
                    </div>
                  </div>
                ) : null}

                {slideId === "services" ? (
                  <div className="relative flex h-full flex-col items-center justify-center text-center text-white">
                    <ul className="space-y-1 font-display text-[clamp(1.4rem,3.4vw,2.4rem)] font-semibold leading-snug tracking-[-0.03em]">
                      <li>{t("home.slides.services.line1")}</li>
                      <li>{t("home.slides.services.line2")}</li>
                      <li>{t("home.slides.services.line3")}</li>
                      <li>{t("home.slides.services.line4")}</li>
                      <li>{t("home.slides.services.line5")}</li>
                    </ul>
                    <p className="mt-4 text-sm text-white/85">
                      {t("home.slides.services.tag")}
                    </p>
                    <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-2.5 sm:gap-3">
                      <StatChip
                        icon={<Fish className="h-3.5 w-3.5" />}
                        label={t("home.features.fishing.title")}
                        value={t("home.slides.services.statFishing")}
                      />
                      <StatChip
                        icon={<ShoppingBasket className="h-3.5 w-3.5" />}
                        label={t("home.features.market.title")}
                        value={t("home.slides.services.statMarket")}
                      />
                      <StatChip
                        icon={<Trash2 className="h-3.5 w-3.5" />}
                        label={t("home.features.bins.title")}
                        value={t("home.slides.services.statBins")}
                      />
                      <StatChip
                        icon={<Footprints className="h-3.5 w-3.5" />}
                        label={t("home.features.plogging.title")}
                        value={t("home.slides.services.statPlogging")}
                      />
                    </div>
                  </div>
                ) : null}

                {slideId === "insights" ? (
                  <div className="flex h-full min-h-0 flex-col text-white">
                    <div className="mb-4">
                      <h2 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-tight">
                        {t("home.slides.insights.title")}
                      </h2>
                      <p className="mt-1 text-sm text-white/80">
                        {t("home.slides.insights.body")}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        ["1,280+", t("home.features.fishing.title")],
                        ["340+", t("home.features.market.title")],
                        ["190+", t("home.features.bins.title")],
                        ["2,410+", t("contribute.title")],
                      ].map(([value, label]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-md"
                        >
                          <p className="font-display text-xl font-semibold">
                            {value}
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/75">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid min-h-0 flex-1 gap-2.5 lg:grid-cols-3">
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
                        <p className="text-xs font-semibold">
                          {t("home.slides.insights.chart")}
                        </p>
                        <div className="mt-3 flex h-28 items-end gap-1.5">
                          {[40, 55, 48, 70, 62, 80, 74, 88, 76, 92, 85, 96].map(
                            (h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t-md bg-[linear-gradient(180deg,#7dd3fc,#2563eb)]"
                                style={{ height: `${h}%` }}
                              />
                            ),
                          )}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
                        <p className="text-xs font-semibold">
                          {t("home.slides.insights.regions")}
                        </p>
                        <ul className="mt-3 space-y-1.5 text-[11px] text-white/85">
                          {[
                            ["부산·경남", "842"],
                            ["강원", "391"],
                            ["전라", "288"],
                            ["제주", "214"],
                          ].map(([name, count]) => (
                            <li
                              key={name}
                              className="flex items-center justify-between rounded-lg bg-white/10 px-2 py-1.5"
                            >
                              <span>{name}</span>
                              <span className="font-semibold">{count}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
                        <p className="text-xs font-semibold">
                          {t("home.slides.insights.timeline")}
                        </p>
                        <ul className="mt-3 space-y-2 text-[11px] text-white/85">
                          <li>· 해운대 수거함 추가 반영</li>
                          <li>· 기장 플로깅 코스 확장</li>
                          <li>· 관광명소 3D 미리보기</li>
                          <li>· 커뮤니티 제보 보드 오픈</li>
                        </ul>
                        <Link
                          href="/sources"
                          className="mt-4 inline-flex h-9 items-center rounded-full border border-white/40 px-3 text-xs font-semibold"
                        >
                          {t("home.slides.insights.cta")}
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Custom video controls */}
            <div className="absolute inset-x-0 bottom-[4.6rem] z-20 flex items-center gap-3 px-4 sm:bottom-[5rem] sm:px-6">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? t("home.hero.pause") : t("home.hero.play")}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#0b2447] shadow-sm"
              >
                {playing ? (
                  <Pause className="h-4 w-4" aria-hidden />
                ) : (
                  <Play className="h-4 w-4" aria-hidden />
                )}
              </button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35">
                <div
                  className="relative h-full rounded-full bg-[#3b82f6] transition-[width] duration-100"
                  style={{ width: `${totalProgress}%` }}
                >
                  <span className="absolute -right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#3b82f6] shadow" />
                </div>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md">
                <AudioLines className="h-4 w-4" aria-hidden />
              </span>
            </div>

            {/* Floating bottom nav */}
            <nav
              className="absolute bottom-3 left-1/2 z-30 flex w-[min(94%,720px)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full bg-[rgba(11,36,71,0.92)] px-2 py-2 text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] sm:bottom-4 sm:px-3 [&::-webkit-scrollbar]:hidden"
              aria-label={t("home.nav.label")}
            >
              <span className="mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
                <Waves className="h-4 w-4" aria-hidden />
              </span>
              {NAV.map((item) => {
                const active = activeNav === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveNav(item.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-[#1d4ed8] text-white"
                        : "text-white/85 hover:bg-white/10"
                    }`}
                  >
                    {item.id === "login" ? (
                      <UserRound className="h-3.5 w-3.5" aria-hidden />
                    ) : null}
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
