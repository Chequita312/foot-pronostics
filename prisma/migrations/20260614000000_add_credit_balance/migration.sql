-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "analysesResetDate",
DROP COLUMN IF EXISTS "analysesUsedThisMonth",
DROP COLUMN IF EXISTS "stripeSubscriptionId",
DROP COLUMN IF EXISTS "subscriptionStatus",
ADD COLUMN "creditBalance" INTEGER NOT NULL DEFAULT 3;
