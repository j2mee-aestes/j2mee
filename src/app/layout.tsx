import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, Nanum_Myeongjo } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  normalizeLocale,
  type SupportedLocale,
} from "@/i18n/config";
import { lookupMessage } from "@/i18n/messages";
import "./globals.css";

const plexSans = IBM_Plex_Sans_KR({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const myeongjo = Nanum_Myeongjo({
  variable: "--font-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

async function resolveLocale(): Promise<SupportedLocale> {
  if (isStaticExport) {
    return DEFAULT_LOCALE;
  }
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_KEY)?.value ?? DEFAULT_LOCALE,
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  return {
    title: lookupMessage(locale, "metadata.homeTitle") ?? "파도파도",
    description:
      lookupMessage(locale, "metadata.homeDescription") ??
      "낚시 장소, 수산시장·손질·식당, 쓰레기통·수거함, 플로깅 코스를 한 지도에서",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await resolveLocale();
  const htmlLang = locale === "zh-CN" ? "zh-CN" : locale;

  return (
    <html
      lang={htmlLang}
      className={`${plexSans.variable} ${myeongjo.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://dapi.kakao.com" />
        <link rel="dns-prefetch" href="https://dapi.kakao.com" />
        <link rel="preconnect" href="https://t1.daumcdn.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://t1.daumcdn.net" />
      </head>
      <body className="min-h-full font-sans text-[var(--color-text-primary)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
