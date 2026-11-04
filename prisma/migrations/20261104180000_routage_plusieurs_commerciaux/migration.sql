-- Un promoteur peut avoir plus de deux commerciaux sur un meme projet : les
-- deux colonnes fixes laissent la place a une liste ordonnee. Aucune regle
-- n'existait encore en base, il n'y a donc rien a reprendre.
ALTER TABLE "RoutageLead" DROP COLUMN "email1";
ALTER TABLE "RoutageLead" DROP COLUMN "email2";
ALTER TABLE "RoutageLead" ADD COLUMN "emails" TEXT[];
