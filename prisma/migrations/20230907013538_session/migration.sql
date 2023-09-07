/*
  Warnings:

  - You are about to drop the column `minutes` on the `UserMachine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "startTime" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserMachine" DROP COLUMN "minutes",
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
