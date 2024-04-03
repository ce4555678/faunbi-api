-- CreateEnum
CREATE TYPE "MethodPayment" AS ENUM ('CreditCard', 'Pix', 'Boleto');

-- AlterTable
ALTER TABLE "anuncios" ADD COLUMN     "pointsExpiration" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "infoUsers" (
    "id" STRING NOT NULL,
    "fullName" STRING NOT NULL,
    "authorId" STRING NOT NULL,
    "CPF" STRING NOT NULL,
    "address" STRING NOT NULL,
    "complementAddress" STRING,
    "moreAddress" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infoUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" STRING NOT NULL,
    "authorId" STRING NOT NULL,
    "concluded" BOOL NOT NULL DEFAULT false,
    "amount" FLOAT8 NOT NULL,
    "method" "MethodPayment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "infoUsers_authorId_key" ON "infoUsers"("authorId");

-- AddForeignKey
ALTER TABLE "infoUsers" ADD CONSTRAINT "infoUsers_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
