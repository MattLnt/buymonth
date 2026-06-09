/*
  Warnings:

  - The values [CANDIDAT,EMPLOYER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Candidate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateAlert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateCV` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateEducation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateExperience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteCandidate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteEmployer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobAlert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileView` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedJob` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OpportuniteStatus" AS ENUM ('PENDING', 'ACTIVE', 'HIDDEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "TypeDeal" AS ENUM ('VENTE', 'FUSION', 'OUVERTURE_CAPITAL', 'COLLABORATION');

-- CreateEnum
CREATE TYPE "PresenceDirigeant" AS ENUM ('OUI', 'OUI_PROVISOIRE', 'NON');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('VENDEUR', 'ACHETEUR', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_userId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateAlert" DROP CONSTRAINT "CandidateAlert_employerId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateCV" DROP CONSTRAINT "CandidateCV_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateEducation" DROP CONSTRAINT "CandidateEducation_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateExperience" DROP CONSTRAINT "CandidateExperience_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Employer" DROP CONSTRAINT "Employer_planId_fkey";

-- DropForeignKey
ALTER TABLE "Employer" DROP CONSTRAINT "Employer_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteCandidate" DROP CONSTRAINT "FavoriteCandidate_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteCandidate" DROP CONSTRAINT "FavoriteCandidate_employerId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteEmployer" DROP CONSTRAINT "FavoriteEmployer_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteEmployer" DROP CONSTRAINT "FavoriteEmployer_employerId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_employerId_fkey";

-- DropForeignKey
ALTER TABLE "JobAlert" DROP CONSTRAINT "JobAlert_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileView" DROP CONSTRAINT "ProfileView_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileView" DROP CONSTRAINT "ProfileView_employerId_fkey";

-- DropForeignKey
ALTER TABLE "SavedJob" DROP CONSTRAINT "SavedJob_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "SavedJob" DROP CONSTRAINT "SavedJob_jobId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "Application";

-- DropTable
DROP TABLE "Candidate";

-- DropTable
DROP TABLE "CandidateAlert";

-- DropTable
DROP TABLE "CandidateCV";

-- DropTable
DROP TABLE "CandidateEducation";

-- DropTable
DROP TABLE "CandidateExperience";

-- DropTable
DROP TABLE "Conversation";

-- DropTable
DROP TABLE "Employer";

-- DropTable
DROP TABLE "FavoriteCandidate";

-- DropTable
DROP TABLE "FavoriteEmployer";

-- DropTable
DROP TABLE "Interview";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "JobAlert";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "ProfileView";

-- DropTable
DROP TABLE "SavedJob";

-- DropEnum
DROP TYPE "AppStatus";

-- DropEnum
DROP TYPE "ContractType";

-- CreateTable
CREATE TABLE "Vendeur" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nomBureau" TEXT NOT NULL,
    "nomCEO" TEXT NOT NULL,
    "logoUrl" TEXT,
    "adresse" TEXT,
    "telephone" TEXT,
    "emailContact" TEXT,

    CONSTRAINT "Vendeur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acheteur" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "subStatus" TEXT,

    CONSTRAINT "Acheteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunite" (
    "id" TEXT NOT NULL,
    "vendeurId" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "chiffreAffaires" DOUBLE PRECISION NOT NULL,
    "nombreClients" INTEGER NOT NULL,
    "nombreCollaborateurs" INTEGER NOT NULL,
    "activites" TEXT[],
    "typeDeal" "TypeDeal" NOT NULL,
    "presenceDirigeant" "PresenceDirigeant" NOT NULL,
    "description" TEXT,
    "status" "OpportuniteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Opportunite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deblocage" (
    "id" TEXT NOT NULL,
    "acheteurId" TEXT NOT NULL,
    "opportuniteId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "packCommission" INTEGER,
    "packAccepte" BOOLEAN NOT NULL DEFAULT false,
    "packAccepteAt" TIMESTAMP(3),
    "contactDemande" BOOLEAN NOT NULL DEFAULT false,
    "contactAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deblocage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendeur_userId_key" ON "Vendeur"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Acheteur_userId_key" ON "Acheteur"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Deblocage_acheteurId_opportuniteId_key" ON "Deblocage"("acheteurId", "opportuniteId");

-- AddForeignKey
ALTER TABLE "Vendeur" ADD CONSTRAINT "Vendeur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acheteur" ADD CONSTRAINT "Acheteur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunite" ADD CONSTRAINT "Opportunite_vendeurId_fkey" FOREIGN KEY ("vendeurId") REFERENCES "Vendeur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deblocage" ADD CONSTRAINT "Deblocage_acheteurId_fkey" FOREIGN KEY ("acheteurId") REFERENCES "Acheteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deblocage" ADD CONSTRAINT "Deblocage_opportuniteId_fkey" FOREIGN KEY ("opportuniteId") REFERENCES "Opportunite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
