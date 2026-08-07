import { z } from "zod";
import { requireAdmin } from "@/server/admin/adminAuthorization";
import { writeAuditLog } from "@/server/admin/auditService";
import { MESSAGES, flattenMessages } from "@/i18n/messages";
import { prisma } from "@/server/db";
import { handleRouteError, jsonOk } from "@/server/http";
import { SUPPORTED_LOCALES } from "@/i18n/config";

const SAFETY_PREFIXES = ["safety.", "errors."];

export async function GET() {
  try {
    await requireAdmin("admin");
    const ko = flattenMessages(MESSAGES.ko);
    const reviews = await prisma.translationReview.findMany();
    const reviewMap = new Map(
      reviews.map((row) => [`${row.messageKey}:${row.locale}`, row]),
    );
    const missing: Array<{
      key: string;
      locale: string;
      koText: string;
      reviewStatus: string;
      isSafety: boolean;
    }> = [];

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === "ko") continue;
      const flat = flattenMessages(MESSAGES[locale]);
      for (const [key, koText] of Object.entries(ko)) {
        const value = flat[key];
        const review = reviewMap.get(`${key}:${locale}`);
        const isSafety = SAFETY_PREFIXES.some((prefix) => key.startsWith(prefix));
        if (!value || value.trim() === "" || review?.reviewStatus === "machineTranslated") {
          missing.push({
            key,
            locale,
            koText,
            reviewStatus: review?.reviewStatus ?? (value ? "machineTranslated" : "missing"),
            isSafety,
          });
        }
      }
    }

    return jsonOk({
      missingCount: missing.length,
      missing: missing.slice(0, 200),
      safetyCount: missing.filter((item) => item.isSafety).length,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

const patchSchema = z.object({
  messageKey: z.string().min(1),
  locale: z.enum(["ko", "en", "ja", "zh-CN", "vi", "es", "de", "fr"]),
  text: z.string().min(1).max(2000),
  reviewStatus: z.enum(["reviewed", "machineTranslated"]),
  isSafety: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin("admin");
    const body = patchSchema.parse(await request.json());
    const row = await prisma.translationReview.upsert({
      where: {
        messageKey_locale: {
          messageKey: body.messageKey,
          locale: body.locale,
        },
      },
      create: {
        messageKey: body.messageKey,
        locale: body.locale,
        text: body.text,
        reviewStatus: body.reviewStatus,
        isSafety: body.isSafety ?? body.messageKey.startsWith("safety."),
        reviewedBy: admin.id,
        reviewedAt: body.reviewStatus === "reviewed" ? new Date() : null,
      },
      update: {
        text: body.text,
        reviewStatus: body.reviewStatus,
        isSafety: body.isSafety ?? body.messageKey.startsWith("safety."),
        reviewedBy: admin.id,
        reviewedAt: body.reviewStatus === "reviewed" ? new Date() : null,
      },
    });
    await writeAuditLog({
      adminUserId: admin.id,
      action: "translation.review",
      entityType: "translation",
      entityId: `${body.messageKey}:${body.locale}`,
      after: row,
    });
    return jsonOk({ review: row });
  } catch (error) {
    return handleRouteError(error);
  }
}
