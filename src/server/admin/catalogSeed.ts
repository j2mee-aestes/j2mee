import { getAllFishingSpots } from "@/lib/fishing/fishingSpotRepository";
import { getAllPartners } from "@/lib/partners/partnerRepository";
import { getAllPloggingRoutes } from "@/lib/environment/ploggingRouteRepository";
import { getAllWastePoints } from "@/lib/environment/wastePointRepository";
import { prisma } from "@/server/db";

let seeded = false;

export async function ensureCatalogSeeded() {
  if (seeded) {
    return;
  }
  const count = await prisma.managedPlace.count();
  if (count > 0) {
    seeded = true;
    return;
  }

  const fishing = getAllFishingSpots().map((spot) => ({
    entityType: "fishing",
    sourceId: spot.id,
    recordStatus: "active",
    verificationStatus: spot.verificationStatus,
    name: spot.name,
    lastVerifiedAt: spot.lastVerifiedAt ?? null,
    payload: JSON.stringify({ ...spot, recordStatus: "active" }),
  }));
  const partners = getAllPartners().map((partner) => ({
    entityType: "partner",
    sourceId: partner.id,
    recordStatus: "active",
    verificationStatus: partner.verificationStatus,
    name: partner.name,
    lastVerifiedAt: partner.lastVerifiedAt ?? null,
    payload: JSON.stringify({ ...partner, recordStatus: "active" }),
  }));
  const waste = getAllWastePoints().map((point) => ({
    entityType: "waste",
    sourceId: point.id,
    recordStatus: "active",
    verificationStatus: point.verificationStatus,
    name: point.name,
    lastVerifiedAt: point.lastVerifiedAt ?? null,
    payload: JSON.stringify({ ...point, recordStatus: "active" }),
  }));
  const plogging = getAllPloggingRoutes().map((route) => ({
    entityType: "plogging",
    sourceId: route.id,
    recordStatus: "active",
    verificationStatus: route.verificationStatus,
    name: route.name,
    lastVerifiedAt: route.lastVerifiedAt ?? null,
    payload: JSON.stringify({ ...route, recordStatus: "active" }),
  }));

  const rows = [...fishing, ...partners, ...waste, ...plogging];
  if (rows.length > 0) {
    await prisma.managedPlace.createMany({ data: rows });
  }
  seeded = true;
}
