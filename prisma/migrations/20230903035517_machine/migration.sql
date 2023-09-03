/*
  Warnings:

  - The primary key for the `Machine` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "UserMachine" DROP CONSTRAINT "UserMachine_machineId_fkey";

-- AlterTable
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Machine_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Machine_id_seq";

-- AlterTable
ALTER TABLE "UserMachine" ALTER COLUMN "machineId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UserMachine" ADD CONSTRAINT "UserMachine_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
