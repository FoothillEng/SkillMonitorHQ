/*
  Warnings:

  - The `apprentice1UMID` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `apprentice2UMID` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `apprentice3UMID` column on the `Session` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "apprentice1UMID",
ADD COLUMN     "apprentice1UMID" INTEGER,
DROP COLUMN "apprentice2UMID",
ADD COLUMN     "apprentice2UMID" INTEGER,
DROP COLUMN "apprentice3UMID",
ADD COLUMN     "apprentice3UMID" INTEGER;
