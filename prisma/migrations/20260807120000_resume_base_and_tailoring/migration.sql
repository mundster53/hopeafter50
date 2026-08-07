-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "baseResumeText" TEXT,
ADD COLUMN     "baseResumeFileUrl" TEXT,
ADD COLUMN     "baseResumeSetAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ResumeTailoring" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "resumeOptimizationId" TEXT,
    "jobDescription" TEXT NOT NULL,
    "tailoredResumeMarkdown" TEXT NOT NULL,
    "matchScore" INTEGER,
    "matchLabel" TEXT,
    "tailoring" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeTailoring_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResumeTailoring" ADD CONSTRAINT "ResumeTailoring_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
