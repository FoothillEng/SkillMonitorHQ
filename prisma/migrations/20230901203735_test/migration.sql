/*
  Warnings:

  - You are about to drop the column `userId` on the `Avatar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avatar" DROP CONSTRAINT "Avatar_userId_fkey";

-- DropIndex
DROP INDEX "Avatar_userId_key";

-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
