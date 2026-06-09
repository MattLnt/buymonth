-- AlterTable
ALTER TABLE "Acheteur" ADD COLUMN     "activites" TEXT[],
ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "chiffreAffaires" DOUBLE PRECISION,
ADD COLUMN     "nomBureau" TEXT,
ADD COLUMN     "nomCEO" TEXT,
ADD COLUMN     "nombreClients" INTEGER,
ADD COLUMN     "nombreCollaborateurs" INTEGER,
ADD COLUMN     "siteInternet" TEXT,
ADD COLUMN     "telephone" TEXT;
