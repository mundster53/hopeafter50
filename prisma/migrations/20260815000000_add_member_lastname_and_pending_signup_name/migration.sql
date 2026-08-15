-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "PendingSignupName" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingSignupName_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingSignupName_email_key" ON "PendingSignupName"("email");
