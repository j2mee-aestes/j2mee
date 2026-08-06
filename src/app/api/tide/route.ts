import { NextResponse } from "next/server";
import { getFishingSpotById } from "@/lib/fishing/fishingSpotRepository";
import { resolveTideStationForSpot } from "@/lib/tide/findNearestTideStation";
import { getDailyTide } from "@/lib/tide/tideService";
import { SAFETY_THRESHOLDS } from "@/constants/safetyThresholds";

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function todayKst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00+09:00`);
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spotId = searchParams.get("spotId");
    const stationIdParam = searchParams.get("stationId");
    const dateParam = searchParams.get("date") ?? todayKst();

    if (!isValidDate(dateParam)) {
      return NextResponse.json(
        { error: "INVALID_DATE", message: "선택한 날짜의 조석정보를 제공할 수 없습니다." },
        { status: 400 },
      );
    }

    const today = todayKst();
    const maxDate = addDays(today, SAFETY_THRESHOLDS.maxTideDateOffsetDays);
    if (dateParam < today || dateParam > maxDate) {
      return NextResponse.json(
        { error: "DATE_OUT_OF_RANGE", message: "선택한 날짜의 조석정보를 제공할 수 없습니다." },
        { status: 400 },
      );
    }

    let stationId = stationIdParam ?? undefined;
    let distanceKm: number | undefined;

    if (spotId) {
      const spot = getFishingSpotById(spotId);
      if (!spot) {
        return NextResponse.json(
          { error: "SPOT_NOT_FOUND", message: "이 장소의 조석정보를 찾지 못했습니다." },
          { status: 404 },
        );
      }
      const nearest = resolveTideStationForSpot({
        coordinates: spot.coordinates,
        nearestTideStationId: spot.nearestTideStationId,
      });
      if (!nearest) {
        return NextResponse.json(
          { error: "STATION_NOT_FOUND", message: "이 장소의 조석정보를 찾지 못했습니다." },
          { status: 404 },
        );
      }
      stationId = nearest.station.id;
      distanceKm = nearest.distanceKm;
    }

    if (!stationId) {
      return NextResponse.json(
        { error: "STATION_REQUIRED", message: "이 장소의 조석정보를 찾지 못했습니다." },
        { status: 400 },
      );
    }

    const tide = await getDailyTide(stationId, dateParam, distanceKm);
    return NextResponse.json(tide, {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "TIDE_FETCH_FAILED", message: "데이터를 불러오는 중 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}
