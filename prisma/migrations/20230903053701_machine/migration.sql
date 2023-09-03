/*
  Warnings:

  - The primary key for the `Machine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Machine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[uuid]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,uuid]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Machine` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `machineUUID` to the `UserMachine` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `machineId` on the `UserMachine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UserMachine" DROP CONSTRAINT "UserMachine_machineId_fkey";

-- AlterTable
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_pkey",
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Machine_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserMachine" ADD COLUMN     "machineUUID" TEXT NOT NULL,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Machine_uuid_key" ON "Machine"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_id_uuid_key" ON "Machine"("id", "uuid");

-- AddForeignKey
ALTER TABLE "UserMachine" ADD CONSTRAINT "UserMachine_machineId_machineUUID_fkey" FOREIGN KEY ("machineId", "machineUUID") REFERENCES "Machine"("id", "uuid") ON DELETE CASCADE ON UPDATE CASCADE;
