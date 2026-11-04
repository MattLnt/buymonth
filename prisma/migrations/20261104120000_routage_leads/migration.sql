-- Routage des leads vers les commerciaux d'un promoteur partenaire (lot Matexi)
CREATE TABLE "RoutageLead" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projet" TEXT,
    "email1" TEXT NOT NULL,
    "email2" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutageLead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RoutageLead_clientId_idx" ON "RoutageLead"("clientId");

ALTER TABLE "RoutageLead" ADD CONSTRAINT "RoutageLead_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
