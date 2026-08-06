import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
/** GitHub Pages static export (`npm run build:gh-pages`). */
const isGhPages = process.env.GITHUB_PAGES === "1";

/**
 * Kakao Maps on http://localhost loads follow-up scripts as http://t1.daumcdn.net/...
 * A https-only CSP blocks those and kakao.maps.load never completes (SDK_LOAD_TIMEOUT).
 * Also need spi.map.kakao.com / mts.daumcdn.net (not covered by single-label *.kakao.com).
 */
const kakaoCspHosts = [
  "https://dapi.kakao.com",
  "http://dapi.kakao.com",
  "https://t1.daumcdn.net",
  "http://t1.daumcdn.net",
  "https://ssl.daumcdn.net",
  "http://ssl.daumcdn.net",
  "https://mts.daumcdn.net",
  "http://mts.daumcdn.net",
  "https://*.daumcdn.net",
  "http://*.daumcdn.net",
  "https://*.kakaocdn.net",
  "http://*.kakaocdn.net",
  "https://*.kakao.com",
  "http://*.kakao.com",
  "https://map.kakao.com",
  "http://map.kakao.com",
  "https://spi.map.kakao.com",
  "http://spi.map.kakao.com",
  "https://*.map.kakao.com",
  "http://*.map.kakao.com",
].join(" ");

const securityHeadersBase = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=()",
  },
];

const cspHeader = {
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${kakaoCspHosts}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `img-src 'self' data: blob: ${kakaoCspHosts}`,
    "font-src 'self' data: https://fonts.gstatic.com https://*.daumcdn.net http://*.daumcdn.net",
    `connect-src 'self' ${kakaoCspHosts}`,
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    `frame-src 'self' ${kakaoCspHosts}`,
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isGhPages
    ? {
        output: "export" as const,
        basePath: "/j2mee",
        assetPrefix: "/j2mee/",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: isProd
                ? [...securityHeadersBase, cspHeader]
                : securityHeadersBase,
            },
            {
              source: "/admin/:path*",
              headers: [
                { key: "Cache-Control", value: "no-store" },
                { key: "X-Robots-Tag", value: "noindex, nofollow" },
              ],
            },
            {
              source: "/my",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
            {
              source: "/schedules",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
            {
              source: "/activities",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
            {
              source: "/login",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
          ];
        },
      }),
  env: {
    NEXT_PUBLIC_ALLOW_MOCK_DATA:
      process.env.ALLOW_MOCK_DATA ??
      (isGhPages ? "true" : isProd ? "false" : "true"),
    NEXT_PUBLIC_BASE_PATH: isGhPages ? "/j2mee" : "",
    NEXT_PUBLIC_STATIC_EXPORT: isGhPages ? "1" : "",
  },
};

export default nextConfig;
