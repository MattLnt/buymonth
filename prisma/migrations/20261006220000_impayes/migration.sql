-- Detection des impayes et delai de grace avant retrait des biens du site.
ALTER TABLE "Client" ADD COLUMN "impayeDepuis" TIMESTAMP(3);
ALTER TABLE "Client" ADD COLUMN "impayeRelanceAt" TIMESTAMP(3);
