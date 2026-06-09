-- CreateTable
CREATE TABLE "FavoriteEmployer" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteEmployer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteEmployer_candidateId_employerId_key" ON "FavoriteEmployer"("candidateId", "employerId");

-- AddForeignKey
ALTER TABLE "FavoriteEmployer" ADD CONSTRAINT "FavoriteEmployer_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteEmployer" ADD CONSTRAINT "FavoriteEmployer_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
