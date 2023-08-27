/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "studentId" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "hours" SET DEFAULT 0,
ALTER COLUMN "level" SET DEFAULT 'LEVEL_1',
ALTER COLUMN "lifetimeHours" SET DEFAULT 0,
ALTER COLUMN "projectCount" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");
