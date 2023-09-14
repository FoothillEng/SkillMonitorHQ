/*
  Warnings:

  - You are about to drop the column `lifetimeHours` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lifetimeHours",
ADD COLUMN     "lifetimeDuration" INTEGER NOT NULL DEFAULT 0;
