/*
  Warnings:

  - A unique constraint covering the columns `[machineUUID]` on the table `UserMachine` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserMachine" ADD COLUMN     "testPassed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tourPassed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usageCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "UserMachine_machineUUID_key" ON "UserMachine"("machineUUID");
