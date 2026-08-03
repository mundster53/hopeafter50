-- AlterTable
ALTER TABLE "WeeklyCheckIn" ADD COLUMN     "aiResponse" JSONB,
ADD COLUMN     "applicationsSubmitted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "interviewsCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "networkingConversations" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "newEmployment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "obstacles" TEXT,
ADD COLUMN     "offersReceived" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "progressNotes" TEXT,
ADD COLUMN     "wins" TEXT;

-- CreateTable
CREATE TABLE "ResumeAnalysis" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "resumeFileUrl" TEXT,
    "resumeText" TEXT NOT NULL,
    "targetRoles" TEXT[],
    "targetIndustries" TEXT[],
    "analysis" JSONB NOT NULL,
    "atsRating" TEXT,
    "overallRating" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeOptimization" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "resumeAnalysisId" TEXT,
    "optimizedResumeMarkdown" TEXT NOT NULL,
    "majorChanges" TEXT[],
    "recommendedFollowUp" TEXT[],
    "confidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeOptimization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunityEvaluation" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "evaluation" JSONB NOT NULL,
    "fitScore" INTEGER,
    "recommendation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpportunityEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "opportunityEvaluationId" TEXT,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "coverLetterMarkdown" TEXT NOT NULL,
    "keyStrengths" TEXT[],
    "customizations" TEXT[],
    "confidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewPrep" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "prep" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewPrep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInOptimization" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "headline" TEXT,
    "about" TEXT,
    "experience" TEXT,
    "analysis" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkedInOptimization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyCheckIn_memberId_week_key" ON "WeeklyCheckIn"("memberId", "week");

-- AddForeignKey
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeOptimization" ADD CONSTRAINT "ResumeOptimization_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunityEvaluation" ADD CONSTRAINT "OpportunityEvaluation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewPrep" ADD CONSTRAINT "InterviewPrep_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedInOptimization" ADD CONSTRAINT "LinkedInOptimization_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

