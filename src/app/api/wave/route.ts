import { NextResponse } from "next/server";
import { getFishingSpotById } from "@/lib/fishing/fishingSpotRepository";
import { getWaveData } from "@/lib/weather/waveService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spotId = searchParams.get("spotId");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    let latitude: number | undefined;
    let longitude: number | undefined;

    if (spotId) {
      const spot = getFishingSpotById(spotId);
      if (!spot) {
        return NextResponse.json(
          { error: "SPOT_NOT_FOUND", message: "파도 정보를 제공할 수 없습니다." },
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
        { error: "COORDINATES_REQUIRED", message: "파도 정보를 제공할 수 없습니다." },
        { status: 400 },
      );
    }

    const wave = await getWaveData({ latitude, longitude });
    return NextResponse.json(wave, {
      headers: { "Cache-Control": "private, max-age=60" },
    });
  } catch {
    return NextResponse.json(
      { error: "WAVE_FETCH_FAILED", message: "파도 정보를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
