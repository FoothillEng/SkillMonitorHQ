/*
  Warnings:

  - You are about to drop the column `ratedByUserId` on the `UserLogin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserLogin" DROP COLUMN "ratedByUserId",
ADD COLUMN     "isloginSession" BOOLEAN NOT NULL DEFAULT false;
