/*
  Warnings:

  - You are about to drop the column `rating` on the `UserMachine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserMachine" DROP COLUMN "rating",
ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "cumulativeRatingSum" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRatingsCount" INTEGER NOT NULL DEFAULT 0;
