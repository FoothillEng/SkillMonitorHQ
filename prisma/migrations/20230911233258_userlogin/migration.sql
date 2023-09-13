/*
  Warnings:

  - You are about to drop the column `rated` on the `UserMachine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserLogin" ADD COLUMN     "logoutTime" TIMESTAMP(3),
ADD COLUMN     "rated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserMachine" DROP COLUMN "rated";
