-- Régime fiscal du bien (TVA 21 % / TVA 6 % / droits d'enregistrement) et TAEG en paramètres admin.
ALTER TABLE "Bien" ADD COLUMN "regime" TEXT;
ALTER TABLE "Settings" ADD COLUMN "taegAnnuel" DOUBLE PRECISION NOT NULL DEFAULT 0.0425;
ALTER TABLE "Settings" ALTER COLUMN "tauxAnnuel" SET DEFAULT 0.0395;
ALTER TABLE "Settings" ALTER COLUMN "dureeMois" SET DEFAULT 360;
