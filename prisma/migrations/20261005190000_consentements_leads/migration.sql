-- Deux consentements distincts et facultatifs par lead (annexe 1 du dossier client
-- du 05/10/2026) : transmission au promoteur, transmission a BuyMonth Finance.
ALTER TABLE "Lead" ADD COLUMN "consentPromoteur" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Lead" ADD COLUMN "consentFinance" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Lead" ADD COLUMN "consentAt" TIMESTAMP(3);

-- Leads existants : jusqu'ici une case unique et obligatoire conditionnait l'envoi,
-- et le lead etait transmis au promoteur comme a BuyMonth Finance. On enregistre
-- cet etat de fait plutot que de les faire apparaitre comme sans consentement.
UPDATE "Lead" SET "consentPromoteur" = true, "consentFinance" = true, "consentAt" = "createdAt";
