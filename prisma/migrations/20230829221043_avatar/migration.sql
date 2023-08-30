/*
  Warnings:

  - You are about to drop the column `profilePath` on the `ActiveStudent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActiveStudent" DROP COLUMN "profilePath",
ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT '';
