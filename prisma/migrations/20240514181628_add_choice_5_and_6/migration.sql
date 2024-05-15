/*
  Warnings:

  - Added the required column `choice5` to the `TestQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `choice6` to the `TestQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestQuestion" ADD COLUMN     "choice5" TEXT NOT NULL,
ADD COLUMN     "choice6" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserMachine" ALTER COLUMN "passedTest" SET DEFAULT true;
