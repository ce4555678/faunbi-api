-- CreateTable
CREATE TABLE "anuncios" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "listingPoints" INT8,
    "image" STRING,
    "openingHours" JSONB NOT NULL,
    "active" BOOL NOT NULL DEFAULT true,
    "certificates" JSONB,
    "slide" STRING[],
    "price" FLOAT8,
    "address" STRING NOT NULL,
    "authorId" STRING NOT NULL,
    "networks" JSONB NOT NULL,
    "contacts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anuncios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anuncios_authorId_key" ON "anuncios"("authorId");

-- AddForeignKey
ALTER TABLE "anuncios" ADD CONSTRAINT "anuncios_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
