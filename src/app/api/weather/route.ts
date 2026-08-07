import { NextResponse } from "next/server";
import { getFishingSpotById } from "@/lib/fishing/fishingSpotRepository";
import {
  getWeather,
  invalidateWeatherCache,
} from "@/lib/weather/weatherService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spotId = searchParams.get("spotId");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const date = searchParams.get("date") ?? undefined;
    const detail = searchParams.get("detail") === "1";
    const refresh = searchParams.get("refresh") === "1";

    let latitude: number | undefined;
    let longitude: number | undefined;
    let locationName: string | undefined;

    if (spotId) {
      const spot = getFishingSpotById(spotId);
      if (!spot) {
        return NextResponse.json(
          { error: "SPOT_NOT_FOUND", message: "현재 날씨정보를 제공할 수 없습니다." },
          { status: 404 },
        );
      }
      latitude = spot.coordinates.latitude;
      longitude = spot.coordinates.longitude;
      locationName = spot.name;
    } else if (lat && lng) {
      latitude = Number(lat);
      longitude = Number(lng);
    }

    if (
      latitude === undefined ||
      longitude === undefined ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return NextResponse.json(
        { error: "COORDINATES_REQUIRED", message: "현재 날씨정보를 제공할 수 없습니다." },
        { status: 400 },
      );
    }

    const coordinates = { latitude, longitude };
    if (refresh) {
      invalidateWeatherCache(coordinates);
    }

    const weather = await getWeather(coordinates, date, {
      detail,
      bypassCache: refresh,
    });
    if (locationName) {
      weather.locationName = locationName;
    }

    return NextResponse.json(weather, {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "WEATHER_FETCH_FAILED", message: "데이터를 불러오는 중 문제가 발생했습니다." },
      { status: 500 },
    );
  }
}
