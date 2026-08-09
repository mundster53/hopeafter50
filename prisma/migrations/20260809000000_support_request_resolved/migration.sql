-- Add resolved tracking to SupportRequest
ALTER TABLE "SupportRequest" ADD COLUMN "resolved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SupportRequest" ADD COLUMN "resolvedAt" TIMESTAMP(3);
