-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "dob" DATETIME,
    "gender" TEXT,
    "category" TEXT,
    "annualIncome" INTEGER,
    "state" TEXT,
    "district" TEXT,
    "domicile" BOOLEAN,
    "course" TEXT,
    "year" INTEGER,
    "college" TEXT,
    "percentage" REAL,
    "disability" BOOLEAN,
    "language" TEXT NOT NULL DEFAULT 'en',
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scheme" (
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
    "verifyNotice" TEXT NOT NULL DEFAULT 'Verify on official portal'
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "deadline" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hasDocument" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "AiUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schemeId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "questionHash" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    CONSTRAINT "AiCache_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Scheme_type_idx" ON "Scheme"("type");

-- CreateIndex
CREATE INDEX "Scheme_title_idx" ON "Scheme"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_schemeId_key" ON "Application"("userId", "schemeId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_schemeId_key" ON "Bookmark"("userId", "schemeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDocument_userId_name_key" ON "UserDocument"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "AiUsage_userId_day_key" ON "AiUsage"("userId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "AiCache_schemeId_language_questionHash_key" ON "AiCache"("schemeId", "language", "questionHash");

