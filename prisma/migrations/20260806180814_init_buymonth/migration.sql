-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Formule" AS ENUM ('PRO', 'PRO_PLUS');

-- CreateEnum
CREATE TYPE "BienStatut" AS ENUM ('ACTIF', 'OPTION', 'HORS_LIGNE', 'VENDU');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "societe" TEXT NOT NULL,
    "contactNom" TEXT,
    "contactOpe" TEXT,
    "contactFacturation" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "adresseAdmin" TEXT,
    "numeroTva" TEXT,
    "logoUrl" TEXT,
    "formule" "Formule" NOT NULL DEFAULT 'PRO',
    "miseEnServicePayee" BOOLEAN NOT NULL DEFAULT false,
    "miseEnServiceAt" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "subStatus" TEXT,
    "subEndsAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan" TEXT NOT NULL DEFAULT 'CLASSIC',
    "widgetsGratuits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bien" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "prixTotal" INTEGER NOT NULL,
    "mensualite" INTEGER NOT NULL,
    "type" TEXT,
    "chambres" INTEGER,
    "sallesDeBain" INTEGER,
    "surface" INTEGER,
    "terrasse" INTEGER,
    "jardin" INTEGER,
    "ville" TEXT,
    "province" TEXT,
    "adresse" TEXT,
    "projet" TEXT,
    "unite" TEXT,
    "pebNumero" TEXT,
    "pebClasse" TEXT,
    "pebKwh" TEXT,
    "images" TEXT[],
    "urlClient" TEXT,
    "statut" "BienStatut" NOT NULL DEFAULT 'ACTIF',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "bienId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WidgetPayment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "bienId" TEXT,
    "montant" INTEGER NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'eur',
    "statut" TEXT NOT NULL DEFAULT 'paid',
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WidgetPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "bienId" TEXT,
    "nom" TEXT,
    "societe" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "revenu" INTEGER,
    "apport" INTEGER,
    "source" TEXT NOT NULL,
    "statutPromoteur" TEXT NOT NULL DEFAULT 'À contacter',
    "statutAdmin" TEXT NOT NULL DEFAULT 'À contacter',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "apportPct" DOUBLE PRECISION NOT NULL DEFAULT 0.10,
    "tauxAnnuel" DOUBLE PRECISION NOT NULL DEFAULT 0.0345,
    "dureeMois" INTEGER NOT NULL DEFAULT 300,
    "leadEmails" TEXT[],
    "essaiActif" BOOLEAN NOT NULL DEFAULT false,
    "essaiJours" INTEGER NOT NULL DEFAULT 14,
    "blocageActif" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bien" ADD CONSTRAINT "Bien_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WidgetPayment" ADD CONSTRAINT "WidgetPayment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
