import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { jsonError, jsonOk } from "@/server/http";

const VOTE_PUBLISH_THRESHOLD = 500;
const MILEAGE_ON_APPROVE = 50;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("UNAUTHORIZED", 401);
  }

  const body = (await request.json().catch(() => null)) as {
    kind?: string;
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    note?: string;
    photoName?: string | null;
  } | null;

  if (
    !body ||
    !body.kind ||
    !body.name?.trim() ||
    !body.address?.trim() ||
    typeof body.latitude !== "number" ||
    typeof body.longitude !== "number" ||
    Number.isNaN(body.latitude) ||
    Number.isNaN(body.longitude)
  ) {
    return jsonError("INVALID_BODY", 400);
  }

  if (!["bin", "attraction", "fishing"].includes(body.kind)) {
    return jsonError("INVALID_KIND", 400);
  }

  const contribution = await prisma.placeContribution.create({
    data: {
      kind: body.kind,
      name: body.name.trim(),
      address: body.address.trim(),
      latitude: body.latitude,
      longitude: body.longitude,
      note: body.note?.trim() || null,
      photoName: body.photoName ?? null,
      userId: session.user.id,
      status: "submitted",
    },
  });

  return jsonOk({ contribution });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const contributions = await prisma.placeContribution.findMany({
    where: {
      ...(kind ? { kind } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: [{ voteCount: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return jsonOk({
    contributions,
    votePublishThreshold: VOTE_PUBLISH_THRESHOLD,
    mileageOnApprove: MILEAGE_ON_APPROVE,
  });
}
