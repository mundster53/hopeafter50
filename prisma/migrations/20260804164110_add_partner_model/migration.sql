-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "memberId" TEXT,
    "email" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "interval" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'complete',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_stripeSessionId_key" ON "Partner"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
