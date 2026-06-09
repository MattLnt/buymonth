-- CreateTable
CREATE TABLE "JobAlert" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "category" TEXT,
    "location" TEXT,
    "contractType" TEXT,
    "type" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobAlert_candidateId_category_location_contractType_type_key" ON "JobAlert"("candidateId", "category", "location", "contractType", "type");

-- AddForeignKey
ALTER TABLE "JobAlert" ADD CONSTRAINT "JobAlert_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
