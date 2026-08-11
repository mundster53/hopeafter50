-- CreateTable
CREATE TABLE "DreamConversation" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "currentLayer" INTEGER NOT NULL DEFAULT 1,
    "conversationHistory" JSONB NOT NULL DEFAULT '[]',
    "purposeDeclaration" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DreamConversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DreamConversation_memberId_key" ON "DreamConversation"("memberId");

-- AddForeignKey
ALTER TABLE "DreamConversation" ADD CONSTRAINT "DreamConversation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

