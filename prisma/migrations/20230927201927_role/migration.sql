/*
  Warnings:

  - You are about to drop the column `admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN', 'TEACHER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "admin",
DROP COLUMN "teacher",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';
