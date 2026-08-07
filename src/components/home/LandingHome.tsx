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
import { publicPath } from "@/lib/paths";
import {
  AudioLines,
  Fish,
  Footprints,
  Map as MapIcon,
  MapPin,
  Pause,
  Play,
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

const SLIDE_DURATION_MS = 5600;

type SlideId = "brand" | "features" | "services" | "insights";

const SLIDES: SlideId[] = ["brand", "features", "services", "insights"];

function FeatureMiniCard({
  href,
  icon,
  title,
  body,
  tone,
  delay,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  body: string;
  tone: string;
  delay: number;
}) {
  return (
    <Link
      href={href}
      className="landing-slide-item flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-[0_12px_28px_-18px_rgba(11,36,71,0.4)] transition duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <span
          className="grid h-8 w-8 place-items-center rounded-full"
          style={{ background: `${tone}18`, color: tone }}
        >
          {icon}
        </span>
        <p className="mt-2 text-sm font-semibold text-[#0b2447]">{title}</p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#5b738a]">
          {body}
        </p>
      </div>
      <div
        className="h-14 border-t border-[#e8f0f7] sm:h-16"
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
  delay,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <div
      className="landing-slide-item rounded-2xl border border-white/25 bg-white/12 px-3 py-2.5 text-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 text-[11px] text-white/85">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 font-brand text-lg tracking-tight">{value}</p>
    </div>
  );
}

export function LandingHome() {
  const { t } = useTranslations();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
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

    let frame = 0;
    let started = 0;

    const tick = (now: number) => {
      if (!started) {
        started = now;
        setSlideProgress(0);
      }
      const elapsed = now - started;
      const ratio = Math.min(1, elapsed / SLIDE_DURATION_MS);
      setSlideProgress(ratio * 100);
      if (ratio >= 1) {
        setSlideIndex((index) => (index + 1) % SLIDES.length);
        setSlideKey((key) => key + 1);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, slideIndex]);

  return (
    <div className="relative min-h-screen overflow-hidden text-[#0b2447]">
      {/* Cool open-sky ocean backdrop */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="landing-sky absolute inset-[-6%] bg-cover bg-center"
          style={{
            backgroundImage: `url(${publicPath("/images/ocean-sky.jpg")})`,
          }}
        />
        <div
          className="landing-sky-slow absolute inset-0 opacity-[0.42] mix-blend-soft-light"
          style={{
            backgroundImage: `url(${publicPath("/images/ocean-bg.jpg")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${publicPath("/images/ocean-horizon.jpg")})`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
            maskImage:
              "linear-gradient(180deg, transparent 0%, black 35%, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, black 35%, black 70%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(95%_75%_at_50%_-8%,rgba(255,255,255,0.62),transparent_58%),linear-gradient(180deg,rgba(186,230,253,0.42)_0%,rgba(224,242,254,0.18)_38%,rgba(8,47,73,0.22)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-100/55 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1220px] flex-col px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-5">
        <header className="mb-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0b2447] text-white shadow-[0_10px_24px_-12px_rgba(11,36,71,0.8)]">
              <Waves className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-brand text-[1.35rem] text-[#0b2447] sm:text-[1.55rem]">
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

        <section className="relative flex min-h-0 flex-1 flex-col">
          <div className="relative flex min-h-[74vh] flex-1 flex-col overflow-hidden rounded-[1.85rem] border border-white/65 bg-white/15 shadow-[0_36px_90px_-32px_rgba(8,30,55,0.5)] backdrop-blur-[1.5px] sm:rounded-[2.4rem] lg:min-h-[80vh]">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={publicPath("/videos/ocean-hero.mp4")}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                poster={publicPath("/images/ocean-horizon.jpg")}
                aria-label={t("home.hero.mediaLabel")}
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,48,0.18)_0%,rgba(7,24,48,0.34)_45%,rgba(7,24,48,0.58)_100%)]"
                aria-hidden
              />

              {/* Optical center of the video stage */}
              <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pb-[7.5rem] pt-4 sm:px-8 sm:pb-[8.25rem]">
                <div
                  key={`${slideId}-${slideKey}`}
                  className="landing-slide w-full max-w-5xl"
                >
                  {slideId === "brand" ? (
                    <div className="mx-auto flex max-w-2xl -translate-y-1 flex-col items-center text-center text-white sm:-translate-y-2">
                      <p className="landing-slide-item font-brand text-[clamp(3.1rem,9.2vw,5.8rem)] leading-[0.94] drop-shadow-[0_12px_28px_rgba(8,28,48,0.35)]">
                        {t("common.serviceName")}
                      </p>
                      <p
                        className="landing-slide-item mt-5 max-w-lg text-[0.98rem] font-medium leading-relaxed tracking-[-0.01em] text-white/92 sm:text-[1.08rem]"
                        style={{ animationDelay: "90ms" }}
                      >
                        {t("home.slides.brand.sub")}
                      </p>
                      <div
                        className="landing-slide-item mt-8 flex flex-wrap items-center justify-center gap-3"
                        style={{ animationDelay: "170ms" }}
                      >
                        <Link
                          href="/map"
                          className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#0b2447]"
                        >
                          <MapIcon className="h-4 w-4" aria-hidden />
                          {t("home.cta.exploreMap")}
                        </Link>
                        <Link
                          href="/contribute"
                          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/55 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md"
                        >
                          <MapPin className="h-4 w-4" aria-hidden />
                          {t("home.cta.contribute")}
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {slideId === "features" ? (
                    <div className="mx-auto grid max-w-5xl items-center gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                      <div className="text-center text-white lg:text-left">
                        <h1 className="landing-slide-item font-brand text-[clamp(1.95rem,4.3vw,3.2rem)] leading-[1.12] drop-shadow-[0_10px_24px_rgba(8,28,48,0.3)]">
                          {t("home.slides.features.title")}
                        </h1>
                        <p
                          className="landing-slide-item mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/88 lg:mx-0 sm:text-[0.98rem]"
                          style={{ animationDelay: "100ms" }}
                        >
                          {t("home.slides.features.body")}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                        <FeatureMiniCard
                          href="/map?category=fishing"
                          icon={<Fish className="h-4 w-4" />}
                          title={t("home.features.fishing.title")}
                          body={t("home.features.fishing.body")}
                          tone="#0284c7"
                          delay={120}
                        />
                        <FeatureMiniCard
                          href="/map?category=market"
                          icon={<ShoppingBasket className="h-4 w-4" />}
                          title={t("home.features.market.title")}
                          body={t("home.features.market.body")}
                          tone="#ea580c"
                          delay={180}
                        />
                        <FeatureMiniCard
                          href="/map?category=trash"
                          icon={<Trash2 className="h-4 w-4" />}
                          title={t("home.features.bins.title")}
                          body={t("home.features.bins.body")}
                          tone="#16a34a"
                          delay={240}
                        />
                        <FeatureMiniCard
                          href="/map?category=plogging"
                          icon={<Footprints className="h-4 w-4" />}
                          title={t("home.features.plogging.title")}
                          body={t("home.features.plogging.body")}
                          tone="#0d9488"
                          delay={300}
                        />
                      </div>
                    </div>
                  ) : null}

                  {slideId === "services" ? (
                    <div className="mx-auto flex max-w-3xl flex-col items-center text-center text-white">
                      <ul className="space-y-1.5 font-brand text-[clamp(1.5rem,3.6vw,2.5rem)] leading-snug">
                        {[
                          "home.slides.services.line1",
                          "home.slides.services.line2",
                          "home.slides.services.line3",
                          "home.slides.services.line4",
                          "home.slides.services.line5",
                        ].map((key, index) => (
                          <li
                            key={key}
                            className="landing-slide-item"
                            style={{ animationDelay: `${80 + index * 70}ms` }}
                          >
                            {t(key as "home.slides.services.line1")}
                          </li>
                        ))}
                      </ul>
                      <p
                        className="landing-slide-item mt-5 text-sm text-white/88"
                        style={{ animationDelay: "430ms" }}
                      >
                        {t("home.slides.services.tag")}
                      </p>
                      <div className="mt-7 grid w-full max-w-2xl grid-cols-2 gap-2.5 sm:gap-3">
                        <StatChip
                          icon={<Fish className="h-3.5 w-3.5" />}
                          label={t("home.features.fishing.title")}
                          value={t("home.slides.services.statFishing")}
                          delay={480}
                        />
                        <StatChip
                          icon={<ShoppingBasket className="h-3.5 w-3.5" />}
                          label={t("home.features.market.title")}
                          value={t("home.slides.services.statMarket")}
                          delay={540}
                        />
                        <StatChip
                          icon={<Trash2 className="h-3.5 w-3.5" />}
                          label={t("home.features.bins.title")}
                          value={t("home.slides.services.statBins")}
                          delay={600}
                        />
                        <StatChip
                          icon={<Footprints className="h-3.5 w-3.5" />}
                          label={t("home.features.plogging.title")}
                          value={t("home.slides.services.statPlogging")}
                          delay={660}
                        />
                      </div>
                    </div>
                  ) : null}

                  {slideId === "insights" ? (
                    <div className="mx-auto w-full max-w-5xl text-white">
                      <div className="mb-4 text-center">
                        <h2 className="landing-slide-item font-brand text-[clamp(1.65rem,3.3vw,2.4rem)] leading-tight">
                          {t("home.slides.insights.title")}
                        </h2>
                        <p
                          className="landing-slide-item mt-2 text-sm text-white/85"
                          style={{ animationDelay: "100ms" }}
                        >
                          {t("home.slides.insights.body")}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          ["1,280+", t("home.features.fishing.title")],
                          ["340+", t("home.features.market.title")],
                          ["190+", t("home.features.bins.title")],
                          ["2,410+", t("contribute.title")],
                        ].map(([value, label], index) => (
                          <div
                            key={label}
                            className="landing-slide-item rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-md"
                            style={{ animationDelay: `${140 + index * 60}ms` }}
                          >
                            <p className="font-brand text-xl">{value}</p>
                            <p className="mt-0.5 text-[11px] text-white/75">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 grid gap-2.5 lg:grid-cols-3">
                        <div
                          className="landing-slide-item rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md"
                          style={{ animationDelay: "380ms" }}
                        >
                          <p className="text-xs font-semibold">
                            {t("home.slides.insights.chart")}
                          </p>
                          <div className="mt-3 flex h-24 items-end gap-1.5">
                            {[40, 55, 48, 70, 62, 80, 74, 88, 76, 92, 85, 96].map(
                              (h, i) => (
                                <div
                                  key={i}
                                  className="landing-bar flex-1 rounded-t-md bg-[linear-gradient(180deg,#7dd3fc,#3b82f6)]"
                                  style={{
                                    height: `${h}%`,
                                    animationDelay: `${420 + i * 35}ms`,
                                  }}
                                />
                              ),
                            )}
                          </div>
                        </div>
                        <div
                          className="landing-slide-item rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md"
                          style={{ animationDelay: "460ms" }}
                        >
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
                        <div
                          className="landing-slide-item rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md"
                          style={{ animationDelay: "540ms" }}
                        >
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
            </div>

            {/* Bottom chrome: nav above, AirSide scrubber on the edge */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-3 pt-16 sm:pb-4">
              <div className="pointer-events-auto mx-auto flex w-full max-w-[720px] flex-col items-center gap-3 px-4 sm:gap-3.5 sm:px-6">
                <nav
                  className="flex w-full items-center gap-1 overflow-x-auto rounded-full bg-[rgba(11,36,71,0.92)] px-2 py-2 text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] sm:px-3 [&::-webkit-scrollbar]:hidden"
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

                <div className="flex w-full items-center gap-3.5 px-0.5">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={
                      playing ? t("home.hero.pause") : t("home.hero.play")
                    }
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#0b2447] shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45)]"
                  >
                    {playing ? (
                      <Pause className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <Play className="h-3.5 w-3.5 pl-0.5" aria-hidden />
                    )}
                  </button>

                  <div className="relative h-9 flex-1">
                    <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-white/40" />
                    <div
                      className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[#f472b6] transition-[width] duration-75 ease-linear"
                      style={{ width: `${slideProgress}%` }}
                    />
                  </div>

                  <span className="grid h-9 w-9 shrink-0 place-items-center text-white/90">
                    <AudioLines className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
