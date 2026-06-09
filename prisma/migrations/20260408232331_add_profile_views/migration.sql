-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "profileViews" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Employer" ADD COLUMN     "profileViews" INTEGER NOT NULL DEFAULT 0;
