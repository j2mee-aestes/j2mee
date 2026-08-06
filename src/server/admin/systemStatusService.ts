export function getSystemStatus() {
  const kakaoConfigured = Boolean(process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY);
  const weatherConfigured = Boolean(
    process.env.WEATHER_API_KEY || process.env.MARINE_WEATHER_API_KEY,
  );
  const allowMock =
    process.env.ALLOW_MOCK_DATA !== "false" &&
    process.env.NODE_ENV !== "production";

  return {
    kakaoMaps: {
      configured: kakaoConfigured,
      provider: kakaoConfigured ? "kakao" : "unavailable",
    },
    weather: {
      configured: weatherConfigured,
      provider: weatherConfigured ? "live" : "mock",
    },
    tide: {
      configured: false,
      provider: "removed",
      note: "Tide feature was removed from product scope.",
    },
    database: {
      configured: Boolean(process.env.DATABASE_URL),
      provider: process.env.DATABASE_URL?.startsWith("file:")
        ? "sqlite"
        : "external",
    },
    auth: {
      credentialsDev: Boolean(process.env.AUTH_DEV_PASSWORD),
      google: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      ),
      kakao: Boolean(
        process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET,
      ),
    },
    allowMockData: allowMock || !weatherConfigured,
    checkedAt: new Date().toISOString(),
  };
}
