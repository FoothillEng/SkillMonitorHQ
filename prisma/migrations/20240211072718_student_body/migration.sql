-- CreateTable
CREATE TABLE "StudentBody" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "StudentBody_pkey" PRIMARY KEY ("id")
);
