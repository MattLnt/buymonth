/*
  Warnings:

  - You are about to drop the column `bio` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `cvUrl` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "bio",
DROP COLUMN "cvUrl",
DROP COLUMN "location",
DROP COLUMN "skills",
DROP COLUMN "title",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "ageRange" TEXT,
ADD COLUMN     "availability" TEXT DEFAULT 'AVAILABLE',
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "city" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "diplome" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "langues" TEXT[],
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "twitter" TEXT,
ALTER COLUMN "experience" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "CandidateCV" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateCV_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CandidateCV" ADD CONSTRAINT "CandidateCV_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
