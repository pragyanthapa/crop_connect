/*
  Warnings:

  - Added the required column `location` to the `Crop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crop" ADD COLUMN     "location" TEXT NOT NULL;
