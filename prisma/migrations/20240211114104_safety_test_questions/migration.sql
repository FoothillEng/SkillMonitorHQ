-- CreateTable
CREATE TABLE "TestQuestion" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "choice1" TEXT NOT NULL,
    "choice2" TEXT NOT NULL,
    "choice3" TEXT NOT NULL,
    "choice4" TEXT NOT NULL,
    "correctChoice" INTEGER NOT NULL,
    "machineId" INTEGER NOT NULL,

    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "UserMachine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
