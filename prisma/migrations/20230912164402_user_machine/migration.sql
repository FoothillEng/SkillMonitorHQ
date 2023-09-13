/*
  Warnings:

  - You are about to drop the column `totalRatingsCount` on the `UserMachine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserMachine" DROP COLUMN "totalRatingsCount",
ADD COLUMN     "cumulativeRatingCount" INTEGER NOT NULL DEFAULT 0;
