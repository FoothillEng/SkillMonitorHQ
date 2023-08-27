/*
  Warnings:

  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_StudentProjects" DROP CONSTRAINT "_StudentProjects_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentProjects" DROP CONSTRAINT "_StudentProjects_B_fkey";

-- DropTable
DROP TABLE "Student";

-- CreateTable
CREATE TABLE "ActiveStudent" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "profilePath" TEXT NOT NULL,
    "hours" INTEGER NOT NULL DEFAULT 0,
    "level" "StudentLevel" NOT NULL DEFAULT 'LEVEL_1',
    "lifetimeHours" INTEGER NOT NULL DEFAULT 0,
    "projectCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ActiveStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllStudents" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL DEFAULT 0,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "AllStudents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveStudent_studentId_key" ON "ActiveStudent"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AllStudents_studentId_key" ON "AllStudents"("studentId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "ActiveStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentProjects" ADD CONSTRAINT "_StudentProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "ActiveStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentProjects" ADD CONSTRAINT "_StudentProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
