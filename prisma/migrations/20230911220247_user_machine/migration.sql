-- AlterTable
ALTER TABLE "UserMachine" ADD COLUMN     "rated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 5;
