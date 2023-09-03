/*
  Warnings:

  - You are about to drop the column `hours` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `projectCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StudentProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_StudentProjects" DROP CONSTRAINT "_StudentProjects_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentProjects" DROP CONSTRAINT "_StudentProjects_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hours",
DROP COLUMN "projectCount";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "_StudentProjects";

-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMachine" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "machineId" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserMachine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserMachine" ADD CONSTRAINT "UserMachine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMachine" ADD CONSTRAINT "UserMachine_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
