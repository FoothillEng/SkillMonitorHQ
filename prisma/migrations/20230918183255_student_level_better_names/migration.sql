/*
  Warnings:

  - The values [LEVEL_1,LEVEL_2,LEVEL_3] on the enum `StudentLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StudentLevel_new" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
ALTER TABLE "User" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "level" TYPE "StudentLevel_new" USING ("level"::text::"StudentLevel_new");
ALTER TYPE "StudentLevel" RENAME TO "StudentLevel_old";
ALTER TYPE "StudentLevel_new" RENAME TO "StudentLevel";
DROP TYPE "StudentLevel_old";
ALTER TABLE "User" ALTER COLUMN "level" SET DEFAULT 'BEGINNER';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "level" SET DEFAULT 'BEGINNER';
