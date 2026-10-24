CREATE TABLE "JobPost" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "organization" TEXT NOT NULL,
  "department" TEXT,
  "postNames" JSONB NOT NULL,
  "vacancies" INTEGER,
  "location" TEXT,
  "state" TEXT,
  "qualification" JSONB NOT NULL,
  "qualificationText" TEXT,
  "ageLimit" JSONB NOT NULL,
  "applicationFee" JSONB NOT NULL,
  "importantDates" JSONB NOT NULL,
  "howToApply" JSONB NOT NULL,
  "documentsRequired" JSONB NOT NULL,
  "selectionProcess" JSONB NOT NULL,
  "officialNotificationUrl" TEXT,
  "applyUrl" TEXT,
  "sourceName" TEXT NOT NULL,
  "sourceUrls" JSONB NOT NULL,
  "sourceQuotes" JSONB NOT NULL,
  "lastChecked" DATETIME,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "evergreen" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "JobPost_status_lastChecked_idx" ON "JobPost"("status", "lastChecked");
CREATE INDEX "JobPost_organization_state_idx" ON "JobPost"("organization", "state");

CREATE TABLE "JobBookmark" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "jobPostId" TEXT NOT NULL,
  CONSTRAINT "JobBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "JobBookmark_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "JobBookmark_userId_jobPostId_key" ON "JobBookmark"("userId", "jobPostId");

CREATE TABLE "JobApplication" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "jobPostId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Planned',
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "JobApplication_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "JobApplication_userId_jobPostId_key" ON "JobApplication"("userId", "jobPostId");
