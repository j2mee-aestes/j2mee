import { z } from "zod";
import { SUPPORTED_LOCALES } from "@/i18n/config";

export const localeSchema = z.enum(
  SUPPORTED_LOCALES as unknown as [string, ...string[]],
);

export const placeTypeSchema = z.enum([
  "fishing",
  "market",
  "restaurant",
  "processingShop",
  "trash",
  "plogging",
]);

export const favoriteInputSchema = z.object({
  sourceId: z.string().min(1).max(120),
  placeType: placeTypeSchema,
});

export const preferenceInputSchema = z.object({
  locale: localeSchema.optional(),
  defaultMapCenterLat: z.number().min(-90).max(90).nullable().optional(),
  defaultMapCenterLng: z.number().min(-180).max(180).nullable().optional(),
  notificationEnabled: z.boolean().optional(),
});

export const schedulePayloadSchema = z
  .object({
    id: z.string().min(1).max(120),
    title: z.string().min(1).max(200),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.string().min(1).max(40),
    items: z.array(z.unknown()).max(50),
    travelMode: z.string().optional(),
    plannedDistanceKm: z.number().optional(),
    plannedDurationMinutes: z.number().optional(),
    notes: z.string().max(2000).optional().nullable(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

export const activityPayloadSchema = z
  .object({
    id: z.string().min(1).max(120),
    scheduleId: z.string().max(120).optional().nullable(),
    scheduleTitle: z.string().max(200).optional(),
    date: z.string().optional(),
    status: z.string().min(1).max(40),
    items: z.array(z.unknown()).max(50),
    startedAt: z.string().optional().nullable(),
    completedAt: z.string().optional().nullable(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

export const importBodySchema = z.object({
  schedules: z.array(schedulePayloadSchema).max(50).optional(),
  activityRuns: z.array(activityPayloadSchema).max(50).optional(),
  favorites: z.array(favoriteInputSchema).max(200).optional(),
  clearLocalAfterImport: z.boolean().optional(),
});
