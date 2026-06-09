-- Ajout des nouveaux champs simples
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "utiliseBrio" BOOLEAN;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "exclusiviteCompagnie" BOOLEAN;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "nomCompagnie" TEXT;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "venteImmeuble" BOOLEAN;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "dossierDigitalise" BOOLEAN;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "caIard" DOUBLE PRECISION;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "caVie" DOUBLE PRECISION;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "caCreditImmo" DOUBLE PRECISION;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "caCreditTempo" DOUBLE PRECISION;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "caPlacement" DOUBLE PRECISION;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "caBanque" DOUBLE PRECISION;
ALTER TABLE "Opportunite" ADD COLUMN IF NOT EXISTS "adressesComplementaires" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Conversion typeDeal scalar -> array
ALTER TABLE "Opportunite" ADD COLUMN "typeDealNew" "TypeDeal"[] DEFAULT ARRAY[]::"TypeDeal"[];
UPDATE "Opportunite" SET "typeDealNew" = ARRAY["typeDeal"::"TypeDeal"];
ALTER TABLE "Opportunite" DROP COLUMN "typeDeal";
ALTER TABLE "Opportunite" RENAME COLUMN "typeDealNew" TO "typeDeal";