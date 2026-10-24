-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "courseType" TEXT;

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New chat',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sources" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topic" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "text" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "lastReviewed" DATETIME,
    "reviewStatus" TEXT NOT NULL DEFAULT 'unreviewed',
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scheme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "rules" JSONB NOT NULL,
    "benefits" TEXT NOT NULL,
    "documents" JSONB NOT NULL,
    "deadline" TEXT NOT NULL DEFAULT 'Check official site',
    "officialLink" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "lastVerified" DATETIME,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedOn" DATETIME,
    "verifyNotice" TEXT NOT NULL DEFAULT 'Verify on official portal'
);
INSERT INTO "new_Scheme" ("benefits", "deadline", "documents", "id", "lastVerified", "officialLink", "provider", "rules", "sourceUrl", "title", "type", "verifyNotice") SELECT "benefits", "deadline", "documents", "id", "lastVerified", "officialLink", "provider", "rules", "sourceUrl", "title", "type", "verifyNotice" FROM "Scheme";
DROP TABLE "Scheme";
ALTER TABLE "new_Scheme" RENAME TO "Scheme";
CREATE INDEX "Scheme_type_idx" ON "Scheme"("type");
CREATE INDEX "Scheme_title_idx" ON "Scheme"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ChatSession_userId_updatedAt_idx" ON "ChatSession"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "ChatMessage_sessionId_createdAt_idx" ON "ChatMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_topic_language_idx" ON "KnowledgeChunk"("topic", "language");
