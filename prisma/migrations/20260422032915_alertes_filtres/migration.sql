-- AlterTable
ALTER TABLE "Acheteur" ADD COLUMN     "alerteCaMax" DOUBLE PRECISION,
ADD COLUMN     "alerteCaMin" DOUBLE PRECISION,
ADD COLUMN     "alerteProvinces" TEXT[],
ADD COLUMN     "alerteTypeDeals" TEXT[];
