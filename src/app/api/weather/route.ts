import { NextResponse } from "next/server";
import { getFishingSpotById } from "@/lib/fishing/fishingSpotRepository";
import { getWeather } from "@/lib/weather/weatherService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spotId = searchParams.get("spotId");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const date = searchParams.get("date") ?? undefined;

    let latitude: number | undefined;
    let longitude: number | undefined;

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

    const weather = await getWeather(
      { latitude, longitude },
      date,
    );

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
