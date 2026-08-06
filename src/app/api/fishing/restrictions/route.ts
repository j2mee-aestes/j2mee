import { NextResponse } from "next/server";
import { getAllFishingSpots } from "@/lib/fishing/fishingSpotRepository";

/**
 * Real-time fishing restriction snapshot.
 * Today returns catalog statuses with a fresh timestamp.
 * Replace body with fishery agency / municipal open API when keys are available.
 */
export async function GET() {
  const fetchedAt = new Date().toISOString();
  const spots = getAllFishingSpots().map((spot) => ({
    id: spot.id,
    name: spot.name,
    fishingAllowedStatus: spot.fishingAllowedStatus,
    restrictionDescription: spot.restrictionDescription ?? null,
    lastVerifiedAt: spot.lastVerifiedAt ?? null,
    sourceName: spot.sourceName ?? "파도파도 낚시터 카탈로그",
    sourceUrl: spot.sourceUrl ?? null,
  }));

  return NextResponse.json(
    {
      fetchedAt,
      provider: process.env.FISHING_RESTRICTION_API_URL
        ? "external"
        : "catalog",
      spots,
    },
    { headers: { "Cache-Control": "private, max-age=120" } },
  );
}
