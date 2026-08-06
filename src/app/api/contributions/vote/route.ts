import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { jsonError, jsonOk } from "@/server/http";

const VOTE_PUBLISH_THRESHOLD = 500;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("UNAUTHORIZED", 401);
  }

  const body = (await request.json().catch(() => null)) as {
    contributionId?: string;
  } | null;

  if (!body?.contributionId) {
    return jsonError("INVALID_BODY", 400);
  }

  const contribution = await prisma.placeContribution.findUnique({
    where: { id: body.contributionId },
  });
  if (!contribution) {
    return jsonError("NOT_FOUND", 404);
  }
  if (!["attraction", "fishing"].includes(contribution.kind)) {
    return jsonError("VOTING_NOT_ALLOWED", 400);
  }

  try {
    await prisma.contributionVote.create({
      data: {
        contributionId: contribution.id,
        userId: session.user.id,
      },
    });
  } catch {
    return jsonError("ALREADY_VOTED", 409);
  }

  const updated = await prisma.placeContribution.update({
    where: { id: contribution.id },
    data: { voteCount: { increment: 1 } },
  });

  if (
    updated.voteCount >= VOTE_PUBLISH_THRESHOLD &&
    updated.status !== "published"
  ) {
    await prisma.placeContribution.update({
      where: { id: updated.id },
      data: { status: "ready_for_publish" },
    });
  }

  return jsonOk({ contribution: updated, threshold: VOTE_PUBLISH_THRESHOLD });
}
