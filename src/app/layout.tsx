import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { AppProviders } from "@/components/providers/AppProviders";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  normalizeLocale,
  type SupportedLocale,
} from "@/i18n/config";
import { lookupMessage } from "@/i18n/messages";
import { KAKAO_MAP_APP_KEY, getKakaoSdkUrl } from "@/lib/map/constants";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_KEY)?.value ?? DEFAULT_LOCALE,
  ) as SupportedLocale;
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
  const cookieStore = await cookies();
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_KEY)?.value ?? DEFAULT_LOCALE,
  );
  const htmlLang = locale === "zh-CN" ? "zh-CN" : locale;

  return (
    <html lang={htmlLang} className={`${plusJakarta.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://dapi.kakao.com" />
        <link rel="dns-prefetch" href="https://dapi.kakao.com" />
        <link rel="preconnect" href="https://t1.daumcdn.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://t1.daumcdn.net" />
        {KAKAO_MAP_APP_KEY ? (
          <link
            rel="preload"
            as="script"
            href={getKakaoSdkUrl(KAKAO_MAP_APP_KEY)}
          />
        ) : null}
      </head>
      <body className="min-h-full font-sans text-[var(--color-text-primary)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
