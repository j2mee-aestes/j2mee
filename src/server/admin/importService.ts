import { z } from "zod";
import { upsertManagedPlace } from "@/server/admin/managedPlaceService";
import { writeAuditLog } from "@/server/admin/auditService";
import type { ManagedEntityType, RecordStatus } from "@/types/admin";

const FORBIDDEN = /못난이|ugly\s*seafood/i;

const baseRow = z.object({
  id: z.string().min(1).max(120),
  name_ko: z.string().min(1).max(200).optional(),
  name: z.string().min(1).max(200).optional(),
  address: z.string().min(1).max(300),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  verification_status: z.string().optional(),
  last_verified_at: z.string().optional(),
  source_name: z.string().optional(),
  source_url: z.string().url().optional().or(z.literal("")),
  record_status: z
    .enum(["draft", "active", "inactive", "archived"])
    .optional(),
});

export type ImportRowResult = {
  id: string;
  action: "create" | "update" | "skip" | "error";
  errors: string[];
  warnings: string[];
  duplicateOf?: string;
};

function displayName(row: z.infer<typeof baseRow>) {
  return row.name_ko || row.name || row.id;
}

function validateForbidden(row: Record<string, unknown>): string[] {
  const errors: string[] = [];
  for (const [key, value] of Object.entries(row)) {
    if (FORBIDDEN.test(key) || (typeof value === "string" && FORBIDDEN.test(value))) {
      errors.push(`forbidden field/value: ${key}`);
    }
  }
  return errors;
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return [];
  }
  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? "";
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current);
  return out;
}

export function previewImport(
  entityType: ManagedEntityType,
  rows: Record<string, unknown>[],
  existingIds: Set<string>,
): ImportRowResult[] {
  return rows.map((raw) => {
    const errors = validateForbidden(raw);
    const parsed = baseRow.safeParse(raw);
    if (!parsed.success) {
      errors.push(...parsed.error.issues.map((issue) => issue.message));
      return {
        id: String(raw.id ?? ""),
        action: "error" as const,
        errors,
        warnings: [],
      };
    }
    if (entityType === "plogging") {
      const path = raw.path_coordinates ?? raw.pathCoordinates;
      if (typeof path === "string") {
        try {
          const coords = JSON.parse(path) as unknown[];
          if (!Array.isArray(coords) || coords.length < 2) {
            errors.push("plogging path needs at least 2 coordinates");
          }
        } catch {
          errors.push("invalid path_coordinates JSON");
        }
      }
    }
    if (errors.length > 0) {
      return {
        id: parsed.data.id,
        action: "error",
        errors,
        warnings: [],
      };
    }
    const duplicate = existingIds.has(parsed.data.id);
    return {
      id: parsed.data.id,
      action: duplicate ? "update" : "create",
      errors: [],
      warnings: duplicate ? ["duplicate id — will update existing"] : [],
      duplicateOf: duplicate ? parsed.data.id : undefined,
    };
  });
}

export async function commitImport(input: {
  adminUserId: string;
  entityType: ManagedEntityType;
  rows: Record<string, unknown>[];
  mode: "allValid" | "createOnly";
}) {
  const existing = await (
    await import("@/server/admin/managedPlaceService")
  ).listManagedPlaces(input.entityType);
  const existingIds = new Set(existing.map((item) => item.sourceId));
  const preview = previewImport(input.entityType, input.rows, existingIds);
  const fatal = preview.some((row) => row.action === "error");
  if (fatal) {
    return { blocked: true as const, preview, imported: 0, updated: 0, skipped: 0 };
  }

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (let index = 0; index < input.rows.length; index += 1) {
    const raw = input.rows[index];
    const plan = preview[index];
    if (plan.action === "skip" || (input.mode === "createOnly" && plan.action === "update")) {
      skipped += 1;
      continue;
    }
    const parsed = baseRow.parse(raw);
    const name = displayName(parsed);
    const recordStatus = (parsed.record_status ?? "active") as RecordStatus;
    const payload: Record<string, unknown> = {
      ...raw,
      id: parsed.id,
      name,
      address: parsed.address,
      coordinates: {
        lat: parsed.latitude,
        lng: parsed.longitude,
      },
      verificationStatus: parsed.verification_status ?? "unverified",
      lastVerifiedAt: parsed.last_verified_at ?? null,
      sourceName: parsed.source_name,
      sourceUrl: parsed.source_url || undefined,
      recordStatus,
    };
    await upsertManagedPlace({
      adminUserId: input.adminUserId,
      entityType: input.entityType,
      sourceId: parsed.id,
      name,
      recordStatus,
      verificationStatus: String(payload.verificationStatus),
      lastVerifiedAt: parsed.last_verified_at ?? null,
      payload,
    });
    if (plan.action === "create") imported += 1;
    else updated += 1;
  }

  await writeAuditLog({
    adminUserId: input.adminUserId,
    action: "import",
    entityType: input.entityType,
    after: { imported, updated, skipped, total: input.rows.length },
  });

  return {
    blocked: false as const,
    preview,
    imported,
    updated,
    skipped,
  };
}

export const IMPORT_TEMPLATES: Record<ManagedEntityType, string> = {
  fishing: [
    "id,name_ko,name_en,address,latitude,longitude,spot_type,fishing_allowed_status,verification_status,last_verified_at,source_name,source_url,record_status",
    "spot-demo,데모낚시터,Demo Spot,부산 기장군,35.2441,129.2185,pier,allowed,admin,2026-08-01,manual,,active",
  ].join("\n"),
  partner: [
    "id,name_ko,address,latitude,longitude,type,verification_status,last_verified_at,source_name,source_url,record_status",
    "partner-demo,데모수산시장,부산 해운대구,35.1631,129.1635,market,admin,2026-08-01,manual,,active",
  ].join("\n"),
  waste: [
    "id,name_ko,type,address,latitude,longitude,status,verification_status,last_verified_at,source_name,source_url,record_status",
    "waste-demo,데모수거함,trashBin,부산 기장군,35.2445,129.2170,available,admin,2026-08-01,manual,,active",
  ].join("\n"),
  plogging: [
    "id,name_ko,address,latitude,longitude,distance_km,path_coordinates,verification_status,last_verified_at,source_name,source_url,record_status",
    'plog-demo,데모코스,부산 기장군,35.2441,129.2180,1.2,"[{""lat"":35.2441,""lng"":129.2180},{""lat"":35.2450,""lng"":129.2190}]",admin,2026-08-01,manual,,active',
  ].join("\n"),
};
