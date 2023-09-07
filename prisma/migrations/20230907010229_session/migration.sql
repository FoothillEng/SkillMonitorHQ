/*
  Warnings:

  - You are about to drop the column `expires` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `AllStudents` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[machineId,machineUUID]` on the table `UserMachine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `machineId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `machineUUID` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Session_sessionToken_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "expires",
DROP COLUMN "sessionToken",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "machineId" INTEGER NOT NULL,
ADD COLUMN     "machineUUID" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AllStudents";

-- CreateIndex
CREATE UNIQUE INDEX "UserMachine_machineId_machineUUID_key" ON "UserMachine"("machineId", "machineUUID");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_machineId_machineUUID_fkey" FOREIGN KEY ("machineId", "machineUUID") REFERENCES "UserMachine"("machineId", "machineUUID") ON DELETE RESTRICT ON UPDATE CASCADE;
