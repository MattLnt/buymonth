-- CreateTable
CREATE TABLE "VueOpportunite" (
    "id" TEXT NOT NULL,
    "opportuniteId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VueOpportunite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VueOpportunite" ADD CONSTRAINT "VueOpportunite_opportuniteId_fkey" FOREIGN KEY ("opportuniteId") REFERENCES "Opportunite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
