-- MasrJobs: early access emails + community events (homepage & events page)

CREATE TABLE "EarlyAccessEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarlyAccessEmail_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EarlyAccessEmail_email_key" ON "EarlyAccessEmail"("email");
CREATE INDEX "EarlyAccessEmail_createdAt_idx" ON "EarlyAccessEmail"("createdAt");

CREATE TABLE "CommunityEvent" (
    "id" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "href" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CommunityEvent_sortOrder_eventDate_idx" ON "CommunityEvent"("sortOrder", "eventDate");
