/*
  Warnings:

  - You are about to drop the column `eexperience` on the `CandidateAlert` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CandidateAlert" DROP COLUMN "eexperience",
ADD COLUMN     "experience" TEXT;
