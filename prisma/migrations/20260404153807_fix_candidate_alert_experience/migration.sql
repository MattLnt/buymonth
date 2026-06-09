/*
  Warnings:

  - You are about to drop the column `experience` on the `CandidateAlert` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CandidateAlert" DROP COLUMN "experience",
ADD COLUMN     "eexperience" TEXT;
