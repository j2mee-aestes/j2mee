-- CreateTable
CREATE TABLE "ManagedPlace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "recordStatus" TEXT NOT NULL DEFAULT 'active',
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "name" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "lastVerifiedAt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlaceReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "description" TEXT NOT NULL,
    "placeNameSnapshot" TEXT,
    "adminNote" TEXT,
    "resolvedById" TEXT,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlaceReport_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "beforeJson" TEXT,
    "afterJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TranslationReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageKey" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "reviewStatus" TEXT NOT NULL DEFAULT 'machineTranslated',
    "isSafety" BOOLEAN NOT NULL DEFAULT false,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "passwordHash" TEXT,
    "preferredLocale" TEXT NOT NULL DEFAULT 'ko',
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "image", "name", "passwordHash", "preferredLocale", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "passwordHash", "preferredLocale", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ManagedPlace_entityType_recordStatus_idx" ON "ManagedPlace"("entityType", "recordStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ManagedPlace_entityType_sourceId_key" ON "ManagedPlace"("entityType", "sourceId");

-- CreateIndex
CREATE INDEX "PlaceReport_status_createdAt_idx" ON "PlaceReport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PlaceReport_entityType_sourceId_idx" ON "PlaceReport"("entityType", "sourceId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "TranslationReview_reviewStatus_isSafety_idx" ON "TranslationReview"("reviewStatus", "isSafety");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationReview_messageKey_locale_key" ON "TranslationReview"("messageKey", "locale");
