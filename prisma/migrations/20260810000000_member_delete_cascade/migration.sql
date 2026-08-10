-- Member deletion was failing: all child tables had ON DELETE RESTRICT,
-- so deleting a member with any associated record (assessment, resume
-- history, etc.) violated a foreign key constraint. Switch these to
-- ON DELETE CASCADE so admin member deletion works as intended.

ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_memberId_fkey";
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RebuildPlan" DROP CONSTRAINT "RebuildPlan_memberId_fkey";
ALTER TABLE "RebuildPlan" ADD CONSTRAINT "RebuildPlan_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WeeklyCheckIn" DROP CONSTRAINT "WeeklyCheckIn_memberId_fkey";
ALTER TABLE "WeeklyCheckIn" ADD CONSTRAINT "WeeklyCheckIn_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MemberMilestone" DROP CONSTRAINT "MemberMilestone_memberId_fkey";
ALTER TABLE "MemberMilestone" ADD CONSTRAINT "MemberMilestone_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ResumeAnalysis" DROP CONSTRAINT "ResumeAnalysis_memberId_fkey";
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ResumeOptimization" DROP CONSTRAINT "ResumeOptimization_memberId_fkey";
ALTER TABLE "ResumeOptimization" ADD CONSTRAINT "ResumeOptimization_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ResumeTailoring" DROP CONSTRAINT "ResumeTailoring_memberId_fkey";
ALTER TABLE "ResumeTailoring" ADD CONSTRAINT "ResumeTailoring_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OpportunityEvaluation" DROP CONSTRAINT "OpportunityEvaluation_memberId_fkey";
ALTER TABLE "OpportunityEvaluation" ADD CONSTRAINT "OpportunityEvaluation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CoverLetter" DROP CONSTRAINT "CoverLetter_memberId_fkey";
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InterviewPrep" DROP CONSTRAINT "InterviewPrep_memberId_fkey";
ALTER TABLE "InterviewPrep" ADD CONSTRAINT "InterviewPrep_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LinkedInOptimization" DROP CONSTRAINT "LinkedInOptimization_memberId_fkey";
ALTER TABLE "LinkedInOptimization" ADD CONSTRAINT "LinkedInOptimization_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DailyEncouragement" DROP CONSTRAINT "DailyEncouragement_memberId_fkey";
ALTER TABLE "DailyEncouragement" ADD CONSTRAINT "DailyEncouragement_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
