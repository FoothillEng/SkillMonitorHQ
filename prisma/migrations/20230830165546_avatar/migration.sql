/*
  Warnings:

  - The `avatar` column on the `ActiveStudent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ActiveStudent" DROP COLUMN "avatar",
ADD COLUMN     "avatar" BYTEA NOT NULL DEFAULT '\x';
