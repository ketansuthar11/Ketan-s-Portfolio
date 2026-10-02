-- CreateTable
CREATE TABLE "PortfolioVisitor" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioVisitor_visitorId_key" ON "PortfolioVisitor"("visitorId");

-- CreateIndex
CREATE INDEX "PortfolioVisitor_lastSeenAt_idx" ON "PortfolioVisitor"("lastSeenAt");
