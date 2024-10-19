/*
  Warnings:

  - A unique constraint covering the columns `[siteId]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[restaurantId]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "siteId" TEXT;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "restaurantId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_siteId_key" ON "Restaurant"("siteId");

-- CreateIndex
CREATE INDEX "Restaurant_siteId_idx" ON "Restaurant"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_restaurantId_key" ON "Site"("restaurantId");

-- CreateIndex
CREATE INDEX "Site_restaurantId_idx" ON "Site"("restaurantId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
