import { prisma } from "@/server/db";
import type { SupportedLocale } from "@/i18n/config";

export const userRepository = {
  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        preferredLocale: true,
        mileageBalance: true,
        createdAt: true,
        updatedAt: true,
        preference: true,
      },
    });
  },

  async updatePreferredLocale(userId: string, locale: SupportedLocale) {
    return prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { preferredLocale: locale },
      }),
      prisma.userPreference.upsert({
        where: { userId },
        create: { userId, locale },
        update: { locale },
      }),
    ]);
  },

  async updatePreference(
    userId: string,
    data: {
      locale?: string;
      defaultMapCenterLat?: number | null;
      defaultMapCenterLng?: number | null;
      notificationEnabled?: boolean;
    },
  ) {
    if (data.locale) {
      await prisma.user.update({
        where: { id: userId },
        data: { preferredLocale: data.locale },
      });
    }
    return prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        locale: data.locale ?? "ko",
        defaultMapCenterLat: data.defaultMapCenterLat ?? null,
        defaultMapCenterLng: data.defaultMapCenterLng ?? null,
        notificationEnabled: data.notificationEnabled ?? false,
      },
      update: {
        ...(data.locale !== undefined ? { locale: data.locale } : {}),
        ...(data.defaultMapCenterLat !== undefined
          ? { defaultMapCenterLat: data.defaultMapCenterLat }
          : {}),
        ...(data.defaultMapCenterLng !== undefined
          ? { defaultMapCenterLng: data.defaultMapCenterLng }
          : {}),
        ...(data.notificationEnabled !== undefined
          ? { notificationEnabled: data.notificationEnabled }
          : {}),
      },
    });
  },

  async exportUserData(userId: string) {
    const [profile, favorites, schedules, activityRuns] = await Promise.all([
      this.getProfile(userId),
      prisma.favoritePlace.findMany({ where: { userId } }),
      prisma.savedSchedule.findMany({ where: { userId } }),
      prisma.activityRunRecord.findMany({ where: { userId } }),
    ]);
    return {
      exportedAt: new Date().toISOString(),
      profile: profile
        ? {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            preferredLocale: profile.preferredLocale,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
          }
        : null,
      favorites: favorites.map((f) => ({
        sourceId: f.sourceId,
        placeType: f.placeType,
        createdAt: f.createdAt,
      })),
      schedules: schedules.map((s) => JSON.parse(s.payload)),
      activityRuns: activityRuns.map((r) => JSON.parse(r.payload)),
    };
  },
};
