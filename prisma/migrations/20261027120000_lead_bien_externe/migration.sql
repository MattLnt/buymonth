-- Lead issu du configurateur d'un partenaire (Vizion) : le bien n'existe pas en base,
-- on conserve le libelle transmis dans l'URL du simulateur.
ALTER TABLE "Lead" ADD COLUMN "bienExterne" TEXT;
