/*
  Warnings:

  - You are about to drop the column `apprentice1Id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `apprentice2Id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `apprentice3Id` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "apprentice1Id",
DROP COLUMN "apprentice2Id",
DROP COLUMN "apprentice3Id",
ADD COLUMN     "apprentice1UMID" TEXT,
ADD COLUMN     "apprentice2UMID" TEXT,
ADD COLUMN     "apprentice3UMID" TEXT;
