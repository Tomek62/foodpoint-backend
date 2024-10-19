/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[siteId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "siteId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Site_userId_key" ON "Site"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_siteId_key" ON "User"("siteId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
