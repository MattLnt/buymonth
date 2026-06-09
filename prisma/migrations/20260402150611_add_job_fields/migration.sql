/*
  Warnings:

  - You are about to drop the column `skills` on the `Job` table. All the data in the column will be lost.
  - The `contractType` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "skills",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "applicationEmail" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "diplome" TEXT,
ADD COLUMN     "langues" TEXT[],
ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEMPS_PLEIN',
DROP COLUMN "contractType",
ADD COLUMN     "contractType" TEXT NOT NULL DEFAULT 'SALARIE';
