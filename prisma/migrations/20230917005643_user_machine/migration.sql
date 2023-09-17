/*
  Warnings:

  - You are about to drop the column `testPassed` on the `UserMachine` table. All the data in the column will be lost.
  - You are about to drop the column `tourPassed` on the `UserMachine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,machineId]` on the table `UserMachine` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserMachine" DROP COLUMN "testPassed",
DROP COLUMN "tourPassed",
ADD COLUMN     "apprentice" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "UserMachine_userId_machineId_key" ON "UserMachine"("userId", "machineId");
