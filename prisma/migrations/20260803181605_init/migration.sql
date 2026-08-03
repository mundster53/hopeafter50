-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ageRange" TEXT,
    "gender" TEXT,
    "faithBasedEncouragement" BOOLEAN NOT NULL DEFAULT false,
    "contactPreference" TEXT NOT NULL DEFAULT 'self_serve',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "situation" TEXT NOT NULL,
    "rebuildDuration" TEXT NOT NULL,
    "primaryFear" TEXT NOT NULL,
    "clarityLevel" TEXT NOT NULL,
    "workInterests" TEXT[],
    "financialRunway" TEXT NOT NULL,
    "usingSavings" BOOLEAN NOT NULL DEFAULT false,
    "interviewFrequency" TEXT NOT NULL,
    "hasCurrentResume" TEXT NOT NULL,
    "aiToolsNeeded" TEXT[],
    "additionalContext" TEXT,
    "successVision" TEXT,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RebuildPlan" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "financialUrgency" INTEGER NOT NULL,
    "currentStage" TEXT NOT NULL,
    "careerDirections" TEXT[],
    "topPriorities" JSONB NOT NULL,
    "recommendedToolIds" TEXT[],
    "todaysAction" JSONB NOT NULL,
    "strengths" TEXT[],
    "watchItems" TEXT[],
    "progressPercent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RebuildPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyCheckIn" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "comment" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberMilestone" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_memberId_key" ON "Assessment"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "RebuildPlan_memberId_key" ON "RebuildPlan"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberMilestone_memberId_milestoneId_key" ON "MemberMilestone"("memberId", "milestoneId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RebuildPlan" ADD CONSTRAINT "RebuildPlan_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckIn" ADD CONSTRAINT "WeeklyCheckIn_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMilestone" ADD CONSTRAINT "MemberMilestone_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
