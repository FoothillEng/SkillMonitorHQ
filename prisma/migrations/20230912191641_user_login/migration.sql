/*
  Warnings:

  - You are about to drop the column `isloginSession` on the `UserLogin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserLogin" DROP COLUMN "isloginSession",
ADD COLUMN     "isLoginSession" BOOLEAN NOT NULL DEFAULT false;
