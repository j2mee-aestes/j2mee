import type { FavoritePlace } from "@/generated/prisma/client";
import { prisma } from "@/server/db";

export type FavoriteInput = {
  sourceId: string;
  placeType: string;
};

export const favoriteRepository = {
  async list(userId: string): Promise<FavoritePlace[]> {
    return prisma.favoritePlace.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async add(userId: string, input: FavoriteInput): Promise<FavoritePlace> {
    return prisma.favoritePlace.upsert({
      where: {
        userId_sourceId_placeType: {
          userId,
          sourceId: input.sourceId,
          placeType: input.placeType,
        },
      },
      create: {
        userId,
        sourceId: input.sourceId,
        placeType: input.placeType,
      },
      update: {},
    });
  },

  async remove(
    userId: string,
    sourceId: string,
    placeType: string,
  ): Promise<boolean> {
    const result = await prisma.favoritePlace.deleteMany({
      where: { userId, sourceId, placeType },
    });
    return result.count > 0;
  },

  async clear(userId: string): Promise<number> {
    const result = await prisma.favoritePlace.deleteMany({ where: { userId } });
    return result.count;
  },
};
