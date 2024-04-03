-- AlterTable
ALTER TABLE "anuncios" ADD COLUMN     "verified" BOOL NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "terms" BOOL NOT NULL DEFAULT false;
