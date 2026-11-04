-- L'admin BuyMonth ouvre le routage des leads pour un promoteur, qui saisit
-- ensuite lui-meme les adresses de ses commerciaux.
ALTER TABLE "Client" ADD COLUMN "routageActif" BOOLEAN NOT NULL DEFAULT false;
