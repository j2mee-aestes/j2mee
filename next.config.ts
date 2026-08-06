import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Phase 12 CSP initially omitted daumcdn connect/script hosts that Kakao Maps
 * needs after the stub SDK loads — that made maps.load hang and surfaced as
 * a false "check domain registration" error. Keep Kakao CDN hosts allowed.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      [
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "https://dapi.kakao.com",
        "https://t1.daumcdn.net",
        "https://*.daumcdn.net",
        "https://*.kakaocdn.net",
      ].join(" "),
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      [
        "img-src 'self' data: blob:",
        "https://*.kakaocdn.net",
        "https://*.daumcdn.net",
        "https://*.kakao.com",
        "https://map.kakao.com",
      ].join(" "),
      "font-src 'self' https://fonts.gstatic.com data: https://*.daumcdn.net",
      [
        "connect-src 'self'",
        "https://dapi.kakao.com",
        "https://*.kakao.com",
        "https://*.daumcdn.net",
        "https://t1.daumcdn.net",
        "https://*.kakaocdn.net",
      ].join(" "),
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "frame-src 'self' https://*.kakao.com https://map.kakao.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
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
  env: {
    NEXT_PUBLIC_ALLOW_MOCK_DATA:
      process.env.ALLOW_MOCK_DATA ?? (isProd ? "false" : "true"),
  },
};

export default nextConfig;
