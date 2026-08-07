-- CreateTable
CREATE TABLE "DailyEncouragement" (
    "id"          TEXT NOT NULL,
    "memberId"    TEXT NOT NULL,
    "date"        TEXT NOT NULL,
    "message"     TEXT NOT NULL,
    "emailSentAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyEncouragement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyEncouragement_memberId_date_key" ON "DailyEncouragement"("memberId", "date");

-- AddForeignKey
ALTER TABLE "DailyEncouragement" ADD CONSTRAINT "DailyEncouragement_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
