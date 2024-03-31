/*
  Warnings:

  - You are about to alter the column `listingPoints` on the `anuncios` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - Added the required column `categoryId` to the `anuncios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('Product', 'Service');

-- AlterTable
ALTER TABLE "anuncios" ADD COLUMN     "categoryId" STRING NOT NULL;
ALTER TABLE "anuncios" ALTER COLUMN "listingPoints" SET DATA TYPE INT4;
ALTER TABLE "anuncios" ALTER COLUMN "networks" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "active" BOOL NOT NULL DEFAULT true,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "image" STRING,
    "slide" STRING[],
    "promotion" TIMESTAMP(3),
    "price" FLOAT8,
    "type" "ItemType" NOT NULL DEFAULT 'Product',
    "anuncioId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" STRING NOT NULL,
    "content" STRING NOT NULL,
    "stars" INT4 NOT NULL DEFAULT 1,
    "itemId" STRING NOT NULL,
    "authorId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviewLikes" (
    "id" STRING NOT NULL,
    "authorId" STRING NOT NULL,
    "reviewId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviewLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" STRING NOT NULL,
    "content" STRING NOT NULL,
    "files" JSONB,
    "anuncioId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postLikes" (
    "id" STRING NOT NULL,
    "authorId" STRING NOT NULL,
    "postId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviewLikes_authorId_reviewId_key" ON "reviewLikes"("authorId", "reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "postLikes_authorId_postId_key" ON "postLikes"("authorId", "postId");

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "anuncios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewLikes" ADD CONSTRAINT "reviewLikes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewLikes" ADD CONSTRAINT "reviewLikes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "anuncios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postLikes" ADD CONSTRAINT "postLikes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postLikes" ADD CONSTRAINT "postLikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
