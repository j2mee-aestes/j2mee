import { toKmaGrid } from "@/lib/weather/kmaGrid";
import { getWindDirection } from "@/lib/weather/openMeteo";
import type { Coordinates } from "@/types/map";
import type { WeatherData } from "@/types/fishing";

const DEFAULT_KMA_BASE =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";

interface KmaItem {
  category?: string;
  obsrValue?: string;
  fcstValue?: string;
  fcstDate?: string;
  fcstTime?: string;
  baseDate?: string;
  baseTime?: string;
}

interface KmaApiBody {
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: {
      items?: { item?: KmaItem | KmaItem[] };
    };
  };
}

function kstNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Ultra-short observation base time (hourly, published ~:40). */
export function getUltraSrtNcstBase(now = kstNow()): {
  baseDate: string;
  baseTime: string;
} {
  const d = new Date(now);
  if (d.getMinutes() < 40) {
    d.setHours(d.getHours() - 1);
  }
  return {
    baseDate: `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`,
    baseTime: `${pad2(d.getHours())}00`,
  };
}

/** Ultra-short forecast base time (every 30 min, published ~:45 / :15). */
export function getUltraSrtFcstBase(now = kstNow()): {
  baseDate: string;
  baseTime: string;
} {
  const d = new Date(now);
  const minute = d.getMinutes();
  if (minute < 45) {
    d.setHours(d.getHours() - 1);
    return {
      baseDate: `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`,
      baseTime: `${pad2(d.getHours())}30`,
    };
  }
  return {
    baseDate: `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`,
    baseTime: `${pad2(d.getHours())}00`,
  };
}

function asItems(raw: KmaItem | KmaItem[] | undefined): KmaItem[] {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "" || value === "강수없음") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function ptyToCondition(pty: number | undefined, sky?: number): {
  condition: string;
  conditionIcon: string;
  weatherCode: number;
} {
  if (pty === 1 || pty === 4) {
    return { condition: "비", conditionIcon: "🌧️", weatherCode: 61 };
  }
  if (pty === 2) {
    return { condition: "비/눈", conditionIcon: "🌨️", weatherCode: 71 };
  }
  if (pty === 3) {
    return { condition: "눈", conditionIcon: "🌨️", weatherCode: 71 };
  }
  if (pty === 5 || pty === 6) {
    return { condition: "빗방울", conditionIcon: "🌦️", weatherCode: 51 };
  }
  if (pty === 7) {
    return { condition: "눈날림", conditionIcon: "🌨️", weatherCode: 71 };
  }
  if (sky === 1) return { condition: "맑음", conditionIcon: "☀️", weatherCode: 0 };
  if (sky === 3) return { condition: "구름많음", conditionIcon: "⛅", weatherCode: 2 };
  if (sky === 4) return { condition: "흐림", conditionIcon: "☁️", weatherCode: 3 };
  return { condition: "맑음", conditionIcon: "☀️", weatherCode: 0 };
}

function windDirFromDeg(deg: number | undefined): string | undefined {
  if (deg === undefined) return undefined;
  return getWindDirection(deg);
}

async function fetchKma(
  path: string,
  params: Record<string, string>,
): Promise<KmaItem[]> {
  const key =
    process.env.KMA_API_KEY?.trim() ||
    process.env.WEATHER_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_KMA_API_KEY?.trim();
  const base =
    process.env.KMA_API_BASE_URL?.trim() ||
    process.env.WEATHER_API_BASE_URL?.trim() ||
    DEFAULT_KMA_BASE;

  if (!key) {
    throw new Error("KMA_API_KEY_MISSING");
  }

  const url = new URL(`${base.replace(/\/$/, "")}/${path}`);
  // data.go.kr keys are often pre-encoded; avoid double-encoding.
  const decodedKey = key.includes("%") ? decodeURIComponent(key) : key;
  url.searchParams.set("serviceKey", decodedKey);
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("dataType", "JSON");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    ...(typeof window === "undefined" ? { next: { revalidate: 300 } } : { cache: "no-store" as RequestCache }),
  });

  if (!response.ok) {
    throw new Error(`KMA_HTTP_${response.status}`);
  }

  const payload = (await response.json()) as KmaApiBody;
  const code = payload.response?.header?.resultCode;
  if (code && code !== "00") {
    throw new Error(`KMA_${code}`);
  }

  return asItems(payload.response?.body?.items?.item);
}

/**
 * Fetch live KMA ultra-short observation (+ optional forecast hours).
 * Requires KMA_API_KEY (공공데이터포털 인증키).
 */
export async function fetchKmaWeather(
  coordinates: Coordinates,
  options?: { detail?: boolean },
): Promise<WeatherData> {
  const { nx, ny } = toKmaGrid(coordinates.latitude, coordinates.longitude);
  const ncstBase = getUltraSrtNcstBase();

  const ncstItems = await fetchKma("getUltraSrtNcst", {
    base_date: ncstBase.baseDate,
    base_time: ncstBase.baseTime,
    nx: String(nx),
    ny: String(ny),
  });

  const obs: Record<string, string> = {};
  for (const item of ncstItems) {
    if (item.category && item.obsrValue !== undefined) {
      obs[item.category] = item.obsrValue;
    }
  }

  const temperatureC = parseNumber(obs.T1H);
  const humidityPercent = parseNumber(obs.REH);
  const precipitationMm = parseNumber(obs.RN1) ?? 0;
  const windSpeedMs = parseNumber(obs.WSD);
  const windDirDeg = parseNumber(obs.VEC);
  const pty = parseNumber(obs.PTY);
  const conditionMeta = ptyToCondition(pty);

  let hourly: WeatherData["hourly"];
  let sky: number | undefined;

  if (options?.detail) {
    try {
      const fcstBase = getUltraSrtFcstBase();
      const fcstItems = await fetchKma("getUltraSrtFcst", {
        base_date: fcstBase.baseDate,
        base_time: fcstBase.baseTime,
        nx: String(nx),
        ny: String(ny),
      });

      const byTime = new Map<string, Record<string, string>>();
      for (const item of fcstItems) {
        if (!item.category || !item.fcstDate || !item.fcstTime) continue;
        const key = `${item.fcstDate}${item.fcstTime}`;
        const row = byTime.get(key) ?? {};
        if (item.fcstValue !== undefined) row[item.category] = item.fcstValue;
        byTime.set(key, row);
      }

      const sorted = [...byTime.entries()].sort(([a], [b]) => a.localeCompare(b));
      const first = sorted[0]?.[1];
      sky = parseNumber(first?.SKY);

      hourly = sorted.slice(0, 6).map(([key, row]) => {
        const date = key.slice(0, 8);
        const time = key.slice(8, 12);
        const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${time.slice(0, 2)}:${time.slice(2, 4)}:00+09:00`;
        const rowPty = parseNumber(row.PTY);
        const rowSky = parseNumber(row.SKY);
        const meta = ptyToCondition(rowPty, rowSky);
        return {
          time: iso,
          temperatureC: parseNumber(row.T1H) ?? temperatureC ?? 0,
          precipitationProbability: parseNumber(row.RN1) !== undefined && (parseNumber(row.RN1) ?? 0) > 0 ? 60 : 10,
          condition: meta.condition,
          conditionIcon: meta.conditionIcon,
          windSpeedMs: parseNumber(row.WSD),
        };
      });
    } catch {
      // detail forecast optional
    }
  }

  const finalCondition = ptyToCondition(pty, sky);
  const hour = kstNow().getHours();
  const isDay = hour >= 6 && hour < 19;
  if (!isDay && finalCondition.weatherCode === 0) {
    finalCondition.conditionIcon = "🌙";
  }

  const forecastTime = `${ncstBase.baseDate.slice(0, 4)}-${ncstBase.baseDate.slice(4, 6)}-${ncstBase.baseDate.slice(6, 8)}T${ncstBase.baseTime.slice(0, 2)}:${ncstBase.baseTime.slice(2, 4)}:00+09:00`;

  return {
    forecastTime,
    temperatureC,
    feelsLikeC: temperatureC,
    humidityPercent,
    precipitationMm,
    condition: finalCondition.condition,
    conditionIcon: finalCondition.conditionIcon,
    weatherCode: finalCondition.weatherCode,
    windSpeedMs,
    windDirection: windDirFromDeg(windDirDeg),
    windGustMs: windSpeedMs !== undefined ? Number((windSpeedMs * 1.3).toFixed(1)) : undefined,
    isDay,
    hourly,
    fetchedAt: new Date().toISOString(),
    sourceName: "기상청 초단기실황",
  };
}

export function hasKmaApiKey(): boolean {
  return Boolean(
    process.env.KMA_API_KEY?.trim() ||
      process.env.WEATHER_API_KEY?.trim() ||
      process.env.NEXT_PUBLIC_KMA_API_KEY?.trim(),
  );
}
