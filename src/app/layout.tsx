import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "바다한끼 MAP",
  description:
    "낚시 장소, 물때, 수산시장, 못난이 수산물, 쓰레기통, 플로깅 코스를 한 지도에서",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-[var(--color-text-primary)]">
        {children}
      </body>
    </html>
  );
}
