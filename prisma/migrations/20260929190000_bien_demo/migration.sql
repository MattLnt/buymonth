-- Flag « bien de démonstration » : bien fictif, à titre d'illustration.
-- Exclu de la vitrine publique dès qu'un vrai bien est en ligne, mais son URL reste accessible pour les démos.
ALTER TABLE "Bien" ADD COLUMN "demo" BOOLEAN NOT NULL DEFAULT false;
