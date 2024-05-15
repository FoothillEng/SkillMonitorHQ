/*
  Warnings:

  - You are about to drop the column `machineId` on the `TestQuestion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestQuestion" DROP CONSTRAINT "TestQuestion_machineId_fkey";

-- AlterTable
ALTER TABLE "TestQuestion" DROP COLUMN "machineId";

-- CreateTable
CREATE TABLE "_MachineToTestQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MachineToTestQuestion_AB_unique" ON "_MachineToTestQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_MachineToTestQuestion_B_index" ON "_MachineToTestQuestion"("B");

-- AddForeignKey
ALTER TABLE "_MachineToTestQuestion" ADD CONSTRAINT "_MachineToTestQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MachineToTestQuestion" ADD CONSTRAINT "_MachineToTestQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
