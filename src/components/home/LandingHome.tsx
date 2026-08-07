"use client";

import Link from "next/link";
import Image from "next/image";
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

const SLIDE_DURATION_MS = 6400;

const SLIDES = [
  { id: "brand", dark: true },
  { id: "features", dark: false },
  { id: "services", dark: true },
  { id: "insights", dark: false },
  { id: "dataviz", dark: true },
] as const;

type SlideId = (typeof SLIDES)[number]["id"];

/** Dotted-mountain columns for the data slide (front ridge). */
const RIDGE_FRONT = [
  6, 9, 13, 18, 24, 31, 39, 48, 58, 68, 78, 87, 94, 99, 100, 96, 88, 78, 68,
  59, 52, 47, 44, 46, 52, 60, 66, 68, 64, 57, 49, 42, 36, 31, 27, 24, 22, 21,
];
const RIDGE_BACK = [
  18, 24, 30, 37, 43, 48, 52, 55, 56, 54, 50, 46, 43, 42, 44, 48, 54, 60, 66,
  70, 72, 70, 66, 61, 56, 52, 49, 47, 46, 47, 49, 52, 54, 55, 54, 51, 47, 43,
];

const MONTHLY_BARS = [
  34, 47, 96, 63, 78, 55, 61, 69, 38, 83, 58, 72,
];

function FeatureCard({
  href,
  icon,
  title,
  body,
  image,
  tone,
  delay,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  body: string;
  image: string;
  tone: string;
  delay: number;
}) {
  return (
    <Link
      href={href}
      className="landing-slide-item group flex min-h-0 flex-col overflow-hidden rounded-[1.15rem] border border-[#e2ecf4] bg-white shadow-[0_14px_34px_-24px_rgba(11,36,71,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-24px_rgba(11,36,71,0.5)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-[#0b2447]/25 text-[#0b2447]">
          {icon}
        </span>
        <p className="mt-2.5 text-[0.95rem] font-bold tracking-tight text-[#0b2447]">
          {title}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#64798e]">
          {body}
        </p>
      </div>
      <div className="relative h-24 overflow-hidden sm:h-28" aria-hidden>
        <Image
          src={image}
          alt=""
          fill
          sizes="280px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${tone}30, transparent 45%, ${tone}22)`,
          }}
        />
      </div>
    </Link>
  );
}

function GlassStat({
  icon,
  label,
  value,
  sub,
  className,
  tilt,
  delay,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  className: string;
  tilt: string;
  delay: number;
}) {
  return (
    <div
      className={`landing-slide-item landing-float absolute hidden w-44 rounded-[1.15rem] border border-white/15 bg-white/[0.07] p-3.5 text-white shadow-[0_24px_50px_-28px_rgba(0,0,0,0.6)] backdrop-blur-md lg:block ${className}`}
      style={
        {
          animationDelay: `${delay}ms`,
          "--tilt": tilt,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center gap-2 text-[11px] text-sky-100/85">
        <span className="grid h-7 w-7 place-items-center rounded-full border border-white/25">
          {icon}
        </span>
        {label}
      </div>
      <p className="mt-2 font-brand text-[1.55rem] leading-none tracking-tight">
        {value}
      </p>
      <p className="mt-1.5 text-[10px] text-sky-200/70">{sub}</p>
    </div>
  );
}

function InsightStat({
  icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  delay: number;
}) {
  return (
    <div
      className="landing-slide-item flex items-center gap-3 px-3 py-1.5 sm:px-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#0b2447]/20 text-[#0b2447]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-[#64798e]">
          {label}
        </p>
        <p className="font-brand text-[1.6rem] leading-tight tracking-tight text-[#0b2447]">
          {value}
        </p>
        <p className="truncate text-[10px] text-[#93a6b8]">{sub}</p>
      </div>
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

  const slide = SLIDES[slideIndex];
  const slideId: SlideId = slide.id;
  const dark = slide.dark;

  const togglePlay = useCallback(() => {
    setPlaying((value) => !value);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [playing, slideId]);

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

  const goToSlide = useCallback((index: number) => {
    setSlideIndex(index);
    setSlideKey((key) => key + 1);
    setSlideProgress(0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-[#0b2447]">
      {/* Calm ocean backdrop framing the hero card */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="landing-sky absolute inset-[-6%] bg-cover bg-center"
          style={{
            backgroundImage: `url(${publicPath("/images/ocean-bg.jpg")})`,
          }}
        />
        <div
          className="absolute inset-0 opacity-45 mix-blend-screen"
          style={{
            backgroundImage: `url(${publicPath("/images/ocean-sky.jpg")})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_-5%,rgba(226,242,252,0.75),transparent_55%),linear-gradient(180deg,rgba(147,214,244,0.35)_0%,rgba(196,231,248,0.12)_45%,rgba(9,42,74,0.3)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-3 pb-12 pt-3 sm:px-6 sm:pt-4 lg:px-9 lg:pt-5">
        {/* ── Top chrome ─────────────────────────────────────── */}
        <header className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/images/padopado-logo.png"
              alt={t("common.serviceName")}
              width={42}
              height={42}
              className="h-[42px] w-[42px] shrink-0 rounded-full object-cover shadow-[0_10px_24px_-12px_rgba(11,36,71,0.55)]"
              priority
            />
            <span className="font-brand text-[1.45rem] tracking-tight text-[#0b2447] sm:text-[1.7rem]">
              {t("common.serviceName")}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector variant="pill" className="hidden sm:inline-flex" />
            <Link
              href="/map"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0b2447] px-4 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(11,36,71,0.8)] transition hover:-translate-y-0.5 sm:h-11 sm:px-5"
            >
              {t("home.cta.openMap")}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </header>

        {/* ── Hero stage ─────────────────────────────────────── */}
        <section className="relative flex min-h-0 flex-1 flex-col pb-7">
          <div className="relative flex min-h-[76vh] flex-1 flex-col overflow-hidden rounded-[1.9rem] shadow-[0_44px_110px_-38px_rgba(6,26,50,0.62)] sm:rounded-[2.35rem] lg:min-h-[80vh]">
            {/* Slide backgrounds */}
            {slideId === "brand" ? (
              <>
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
                  className="absolute inset-0 bg-[linear-gradient(115deg,rgba(5,18,40,0.72)_0%,rgba(6,26,54,0.42)_46%,rgba(6,22,46,0.55)_100%)]"
                  aria-hidden
                />
              </>
            ) : null}

            {slideId === "features" || slideId === "insights" ? (
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f6fafd_58%,#eef5fa_100%)]"
                aria-hidden
              />
            ) : null}

            {slideId === "services" ? (
              <div className="absolute inset-0" aria-hidden>
                <div className="absolute inset-0 bg-[linear-gradient(155deg,#03102b_0%,#081d43_48%,#0b2a5c_100%)]" />
                <div className="landing-dots absolute inset-0 text-sky-300/25" />
                <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_30%,rgba(2,10,26,0.62)_100%)]" />
              </div>
            ) : null}

            {slideId === "dataviz" ? (
              <div className="absolute inset-0" aria-hidden>
                <div className="absolute inset-0 bg-[linear-gradient(150deg,#0d346f_0%,#0a2a5d_45%,#071c40_100%)]" />
                <div className="landing-dots absolute inset-0 text-sky-300/15" />
              </div>
            ) : null}

            {/* Slide content */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pb-[4.6rem] pt-4 sm:px-9 sm:pb-[5.2rem]">
              <div
                key={`${slideId}-${slideKey}`}
                className="landing-slide h-full w-full max-w-6xl"
              >
                {/* 1 ── Brand hero */}
                {slideId === "brand" ? (
                  <div className="flex h-full items-center">
                    <div className="relative max-w-xl border-l border-white/45 pl-6 text-white sm:pl-9">
                      <p className="landing-slide-item font-brand text-[clamp(3.2rem,8.4vw,5.9rem)] leading-[0.98] drop-shadow-[0_14px_34px_rgba(3,16,36,0.5)]">
                        {t("common.serviceName")}
                      </p>
                      <p
                        className="landing-slide-item mt-4 max-w-md text-[0.95rem] font-medium leading-relaxed text-white/88 sm:text-[1.05rem]"
                        style={{ animationDelay: "110ms" }}
                      >
                        {t("home.slides.brand.sub")}
                      </p>
                      <div
                        className="landing-slide-item mt-8 flex flex-wrap items-center gap-3"
                        style={{ animationDelay: "200ms" }}
                      >
                        <Link
                          href="/map"
                          className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#0b2447] shadow-[0_16px_38px_-16px_rgba(0,0,0,0.55)] transition hover:-translate-y-0.5"
                        >
                          <MapIcon className="h-4 w-4" aria-hidden />
                          {t("home.cta.exploreMap")}
                        </Link>
                        <Link
                          href="/contribute"
                          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/60 bg-white/5 px-5 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15"
                        >
                          <MapPin className="h-4 w-4" aria-hidden />
                          {t("home.cta.contribute")}
                        </Link>
                      </div>
                    </div>

                    {/* Floating glow badges (desktop) */}
                    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
                      {[
                        { icon: <Camera className="h-4 w-4" />, cls: "right-[34%] top-[22%]", d: "0s" },
                        { icon: <Fish className="h-4 w-4" />, cls: "right-[14%] top-[30%]", d: "0.9s" },
                        { icon: <Sailboat className="h-4 w-4" />, cls: "right-[22%] top-[52%]", d: "1.7s" },
                        { icon: <Trash2 className="h-4 w-4" />, cls: "right-[38%] bottom-[24%]", d: "2.4s" },
                      ].map((b, i) => (
                        <span
                          key={i}
                          className={`landing-float absolute grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/10 text-white shadow-[0_0_28px_rgba(125,211,252,0.4)] backdrop-blur-md ${b.cls}`}
                          style={{ animationDelay: b.d }}
                        >
                          {b.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* 2 ── Light feature cards */}
                {slideId === "features" ? (
                  <div className="grid h-full items-center gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
                    <div className="text-center lg:text-left">
                      <h1 className="landing-slide-item font-brand text-[clamp(2.1rem,4.6vw,3.5rem)] leading-[1.22] text-[#0b2447]">
                        {t("home.slides.features.title")}
                      </h1>
                      <p
                        className="landing-slide-item mx-auto mt-4 max-w-md text-sm leading-[1.9] text-[#5b738a] lg:mx-0 sm:text-[0.95rem]"
                        style={{ animationDelay: "110ms" }}
                      >
                        {t("home.slides.features.body")}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <FeatureCard
                        href="/map?category=fishing"
                        icon={<Fish className="h-4 w-4" />}
                        title={t("categories.fishing.shortLabel")}
                        body={t("home.features.fishing.body")}
                        image={publicPath("/images/ocean-horizon.jpg")}
                        tone="#0e7490"
                        delay={140}
                      />
                      <FeatureCard
                        href="/map?category=market"
                        icon={<ShoppingBasket className="h-4 w-4" />}
                        title={t("categories.market.shortLabel")}
                        body={t("home.features.market.body")}
                        image={publicPath("/images/ocean-bg.jpg")}
                        tone="#b45309"
                        delay={210}
                      />
                      <FeatureCard
                        href="/map?category=trash"
                        icon={<Trash2 className="h-4 w-4" />}
                        title={t("categories.trash.shortLabel")}
                        body={t("home.features.bins.body")}
                        image={publicPath("/images/ocean-sky.jpg")}
                        tone="#166534"
                        delay={280}
                      />
                      <FeatureCard
                        href="/map?category=plogging"
                        icon={<Footprints className="h-4 w-4" />}
                        title={t("categories.plogging.shortLabel")}
                        body={t("home.features.plogging.body")}
                        image={publicPath("/images/ocean-horizon.jpg")}
                        tone="#0f766e"
                        delay={350}
                      />
                    </div>
                  </div>
                ) : null}

                {/* 3 ── Dark typographic services */}
                {slideId === "services" ? (
                  <div className="relative flex h-full flex-col items-center justify-center text-center text-white">
                    <ul className="space-y-2 font-brand text-[clamp(1.7rem,4vw,2.9rem)] leading-[1.35] drop-shadow-[0_10px_30px_rgba(0,10,30,0.6)]">
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
                          style={{ animationDelay: `${90 + index * 80}ms` }}
                        >
                          {t(key)}
                        </li>
                      ))}
                    </ul>
                    <p
                      className="landing-slide-item mt-6 text-[0.85rem] tracking-wide text-sky-100/75"
                      style={{ animationDelay: "520ms" }}
                    >
                      {t("home.slides.services.tag")}
                    </p>

                    <GlassStat
                      icon={<Fish className="h-3.5 w-3.5" />}
                      label={t("home.slides.services.line1")}
                      value="123"
                      sub={t("home.slides.services.statFishing")}
                      className="left-[5%] top-[14%]"
                      tilt="-8deg"
                      delay={260}
                    />
                    <GlassStat
                      icon={<ShoppingBasket className="h-3.5 w-3.5" />}
                      label={t("home.slides.services.line2")}
                      value="87"
                      sub={t("home.slides.services.statMarket")}
                      className="bottom-[16%] left-[9%]"
                      tilt="6deg"
                      delay={360}
                    />
                    <GlassStat
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                      label={t("home.slides.services.line3")}
                      value="632"
                      sub={t("home.slides.services.statBins")}
                      className="right-[5%] top-[13%]"
                      tilt="7deg"
                      delay={320}
                    />
                    <GlassStat
                      icon={<Footprints className="h-3.5 w-3.5" />}
                      label={t("home.slides.services.line4")}
                      value="56"
                      sub={t("home.slides.services.statPlogging")}
                      className="bottom-[18%] right-[8%]"
                      tilt="-6deg"
                      delay={420}
                    />
                  </div>
                ) : null}

                {/* 4 ── Light data dashboard */}
                {slideId === "insights" ? (
                  <div className="flex h-full flex-col justify-center">
                    <div className="text-center">
                      <h2 className="landing-slide-item font-brand text-[clamp(1.7rem,3.6vw,2.7rem)] leading-tight text-[#0b2447]">
                        {t("home.slides.insights.title")}
                      </h2>
                      <p
                        className="landing-slide-item mt-2 text-[0.85rem] text-[#7b90a3]"
                        style={{ animationDelay: "90ms" }}
                      >
                        {t("home.slides.insights.body")}
                      </p>
                    </div>

                    <div className="mx-auto mt-6 grid w-full max-w-4xl grid-cols-2 gap-y-3 sm:divide-x sm:divide-[#e4edf4] lg:grid-cols-4">
                      <InsightStat
                        icon={<MapPin className="h-4 w-4" />}
                        label={t("home.slides.insights.statFishingLabel")}
                        value="1,280+"
                        sub={t("home.slides.insights.statFishingSub")}
                        delay={160}
                      />
                      <InsightStat
                        icon={<ShoppingBasket className="h-4 w-4" />}
                        label={t("categories.market.shortLabel")}
                        value="340+"
                        sub={t("home.slides.insights.statMarketSub")}
                        delay={220}
                      />
                      <InsightStat
                        icon={<Trash2 className="h-4 w-4" />}
                        label={t("home.slides.insights.statBinsLabel")}
                        value="190+"
                        sub={t("home.slides.insights.statBinsSub")}
                        delay={280}
                      />
                      <InsightStat
                        icon={<UserRound className="h-4 w-4" />}
                        label={t("home.slides.insights.statReportsLabel")}
                        value="2,410+"
                        sub={t("home.slides.insights.statReportsSub")}
                        delay={340}
                      />
                    </div>

                    <div className="mt-6 grid gap-3 lg:grid-cols-[1.15fr_1fr_1fr]">
                      {/* Monthly bars */}
                      <div
                        className="landing-slide-item rounded-[1.15rem] border border-[#e4edf4] bg-white p-4 shadow-[0_16px_36px_-30px_rgba(11,36,71,0.5)]"
                        style={{ animationDelay: "380ms" }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#0b2447]">
                            {t("home.slides.insights.chart")}
                          </p>
                          <div className="flex items-center gap-3 text-[9px] text-[#7b90a3]">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#1d4ed8]" />
                              {t("home.slides.insights.legendReports")}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#93c5fd]" />
                              {t("home.slides.insights.legendParticipants")}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex h-24 items-end gap-[5px] sm:h-28">
                          {MONTHLY_BARS.map((h, i) => (
                            <div
                              key={i}
                              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                            >
                              <div
                                className="landing-bar w-full rounded-t-[3px] bg-[linear-gradient(180deg,#3b82f6,#1e40af)]"
                                style={{
                                  height: `${h}%`,
                                  animationDelay: `${430 + i * 30}ms`,
                                }}
                              />
                              <span className="text-[8px] leading-none text-[#a5b6c5]">
                                {i + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Regional activity */}
                      <div
                        className="landing-slide-item rounded-[1.15rem] border border-[#e4edf4] bg-white p-4 shadow-[0_16px_36px_-30px_rgba(11,36,71,0.5)]"
                        style={{ animationDelay: "440ms" }}
                      >
                        <p className="text-xs font-bold text-[#0b2447]">
                          {t("home.slides.insights.regions")}
                        </p>
                        <div className="mt-3 flex gap-3">
                          <div className="landing-dots relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eaf3fa] text-[#3b82f6]/35 sm:h-32">
                            {[
                              "left-[52%] top-[16%] h-2.5 w-2.5",
                              "left-[30%] top-[36%] h-2 w-2",
                              "left-[58%] top-[44%] h-3 w-3",
                              "left-[40%] top-[62%] h-2 w-2",
                              "left-[62%] top-[70%] h-2.5 w-2.5",
                              "left-[34%] top-[84%] h-1.5 w-1.5",
                            ].map((cls, i) => (
                              <span
                                key={i}
                                className={`absolute rounded-full bg-[#1d4ed8]/75 ${cls}`}
                              />
                            ))}
                          </div>
                          <ul className="min-w-0 flex-1 space-y-1 text-[11px]">
                            {[
                              ["경기", 532],
                              ["강원", 284],
                              ["충청", 412],
                              ["전라", 618],
                              ["경상", 756],
                              ["제주", 192],
                            ].map(([name, count]) => (
                              <li
                                key={name}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="text-[#64798e]">{name}</span>
                                <span className="flex flex-1 items-center">
                                  <span
                                    className="ml-auto h-1 rounded-full bg-[#bfdbfe]"
                                    style={{
                                      width: `${(Number(count) / 756) * 64}%`,
                                    }}
                                  />
                                </span>
                                <span className="font-semibold text-[#0b2447]">
                                  {count}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Activity timeline */}
                      <div
                        className="landing-slide-item rounded-[1.15rem] border border-[#e4edf4] bg-white p-4 shadow-[0_16px_36px_-30px_rgba(11,36,71,0.5)]"
                        style={{ animationDelay: "500ms" }}
                      >
                        <p className="text-xs font-bold text-[#0b2447]">
                          {t("home.slides.insights.timeline")}
                        </p>
                        <ul className="mt-3 divide-y divide-[#eef4f9]">
                          {[
                            [<Trash2 key="i" className="h-3.5 w-3.5" />, t("home.slides.insights.timeline1"), "2025.05.21"],
                            [<Waves key="i" className="h-3.5 w-3.5" />, t("home.slides.insights.timeline2"), "2025.05.15"],
                            [<Fish key="i" className="h-3.5 w-3.5" />, t("home.slides.insights.timeline3"), "2025.05.10"],
                            [<ShoppingBasket key="i" className="h-3.5 w-3.5" />, t("home.slides.insights.timeline4"), "2025.05.05"],
                          ].map(([icon, text, date], i) => (
                            <li key={i} className="flex items-center gap-2.5 py-2">
                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#e4edf4] text-[#3b6a8f]">
                                {icon}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-[11px] text-[#37516a]">
                                {text}
                              </span>
                              <span className="shrink-0 text-[9px] text-[#a5b6c5]">
                                {date}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* 5 ── Deep-blue data visual */}
                {slideId === "dataviz" ? (
                  <div className="relative flex h-full flex-col text-white">
                    <div className="grid flex-1 items-center gap-6 pb-[26%] lg:grid-cols-[1fr_1.15fr] lg:pb-[18%]">
                      <div className="landing-slide-item order-2 lg:order-1">
                        <div className="flex items-center gap-2.5">
                          {[
                            <Fish key="f" className="h-4 w-4" />,
                            <Sailboat key="s" className="h-4 w-4" />,
                            <Trash2 key="t" className="h-4 w-4" />,
                          ].map((icon, i) => (
                            <span
                              key={i}
                              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/5 backdrop-blur-sm"
                            >
                              {icon}
                            </span>
                          ))}
                        </div>
                        <dl className="mt-5 grid max-w-xs grid-cols-2 gap-x-6 gap-y-4">
                          {[
                            [t("home.slides.dataviz.labelFishing"), "12,458+"],
                            [t("home.slides.dataviz.labelTide"), t("home.slides.dataviz.live")],
                            [t("home.slides.dataviz.labelBins"), "2,350+"],
                            [t("home.slides.dataviz.labelTour"), "8,760+"],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <dt className="text-[10px] tracking-wide text-sky-200/70">
                                {label}
                              </dt>
                              <dd className="mt-0.5 font-brand text-[1.45rem] leading-tight tracking-tight">
                                {value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      <div className="order-1 text-center lg:order-2 lg:text-right">
                        <h2 className="landing-slide-item font-brand text-[clamp(2rem,4.4vw,3.2rem)] leading-tight drop-shadow-[0_10px_30px_rgba(0,10,30,0.55)]">
                          {t("home.slides.dataviz.title")}
                        </h2>
                        <p
                          className="landing-slide-item mt-2.5 text-[0.85rem] text-sky-100/80"
                          style={{ animationDelay: "110ms" }}
                        >
                          {t("home.slides.dataviz.body")}
                        </p>
                        <Link
                          href="/sources"
                          className="landing-slide-item mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-white/45 px-5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                          style={{ animationDelay: "200ms" }}
                        >
                          <MapIcon className="h-3.5 w-3.5" aria-hidden />
                          {t("home.slides.dataviz.cta")}
                        </Link>
                      </div>
                    </div>

                    {/* Dotted ridge */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]"
                      aria-hidden
                    >
                      <div className="absolute inset-0 flex items-end gap-[3px] px-2 opacity-45 text-[#60a5fa]">
                        {RIDGE_BACK.map((h, i) => (
                          <div
                            key={i}
                            className="landing-dotcol flex-1"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-end gap-[3px] px-2 text-[#dbeafe]">
                        {RIDGE_FRONT.map((h, i) => (
                          <div
                            key={i}
                            className="landing-dotcol flex-1"
                            style={{
                              height: `${h}%`,
                              opacity: 0.55 + (h / 100) * 0.45,
                            }}
                          />
                        ))}
                      </div>

                      <span className="absolute bottom-[52%] left-[14%] rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#0b2447] shadow-[0_8px_22px_-8px_rgba(0,0,0,0.5)]">
                        {t("home.slides.dataviz.tideChip")}
                      </span>
                      <span className="absolute left-[38%] top-[6%] text-[9px] tracking-wide text-sky-200/75">
                        ── {t("home.slides.dataviz.chipFishing")}
                      </span>
                      <span className="absolute right-[26%] top-0 text-[9px] tracking-wide text-sky-200/75">
                        ── {t("home.slides.dataviz.chipTour")}
                      </span>
                    </div>

                    <p className="landing-slide-item absolute bottom-1 right-1 flex items-center gap-1.5 text-[10px] text-sky-200/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {t("home.slides.dataviz.updated")} 2026.08.07 10:20
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* In-card scrubber */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-4 sm:px-8 sm:pb-5">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? t("home.hero.pause") : t("home.hero.play")}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${
                    dark
                      ? "border-white/45 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                      : "border-[#d7e4ee] bg-white text-[#0b2447] shadow-[0_8px_20px_-10px_rgba(11,36,71,0.4)] hover:border-[#b6cddd]"
                  }`}
                >
                  {playing ? (
                    <Pause className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Play className="h-3.5 w-3.5 pl-0.5" aria-hidden />
                  )}
                </button>

                <div className="relative h-10 flex-1">
                  <button
                    type="button"
                    aria-label={t("home.nav.label")}
                    onClick={() =>
                      goToSlide((slideIndex + 1) % SLIDES.length)
                    }
                    className="absolute inset-0"
                  />
                  <div
                    className={`pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full ${
                      dark ? "bg-white/28" : "bg-[#d9e6ef]"
                    }`}
                  />
                  <div
                    className={`pointer-events-none absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full ${
                      dark ? "bg-sky-300" : "bg-[#1d4ed8]"
                    }`}
                    style={{ width: `${slideProgress}%` }}
                  />
                  <span
                    className={`pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 bg-white shadow ${
                      dark ? "border-sky-300" : "border-[#1d4ed8]"
                    }`}
                    style={{ left: `calc(${slideProgress}% - 6px)` }}
                  />
                </div>

                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center ${
                    dark ? "text-white/85" : "text-[#0b2447]/75"
                  }`}
                >
                  <AudioLines className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </div>
          </div>

          {/* ── Floating bottom nav ──────────────────────────── */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-0.5 z-30 flex justify-center">
            <nav
              className="pointer-events-auto flex max-w-[94vw] items-center overflow-x-auto rounded-full bg-[#0a1e3c]/[0.97] px-2.5 py-2 text-white shadow-[0_24px_54px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label={t("home.nav.label")}
            >
              <span className="mr-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#12305c]">
                <Waves className="h-4 w-4" aria-hidden />
              </span>
              {NAV.map((item, index) => {
                const active = activeNav === item.id;
                return (
                  <span key={item.id} className="flex shrink-0 items-center">
                    {index > 0 ? (
                      <span
                        className="mx-1 h-4 w-px shrink-0 bg-white/15"
                        aria-hidden
                      />
                    ) : null}
                    <Link
                      href={item.href}
                      onClick={() => setActiveNav(item.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition ${
                        active
                          ? "border border-white/45 bg-white/[0.08] text-white"
                          : "border border-transparent text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {item.id === "login" ? (
                        <UserRound className="h-3.5 w-3.5" aria-hidden />
                      ) : null}
                      {t(item.labelKey)}
                    </Link>
                  </span>
                );
              })}
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
