-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Email', 'Google');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Anunciante', 'Moderator', 'Admin');

-- CreateTable
CREATE TABLE "users" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "emailVerified" BOOL NOT NULL DEFAULT false,
    "password" STRING,
    "avatar" STRING,
    "provider" "Provider" NOT NULL DEFAULT 'Email',
    "role" "Role" NOT NULL DEFAULT 'User',
    "block" BOOL NOT NULL DEFAULT false,
    "city" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
