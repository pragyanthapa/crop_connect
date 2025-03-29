/*
  Warnings:

  - Added the required column `experience` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmSize` to the `Farmer` table without a default value. This is not possible if the table is not empty.

*/
-- First add the columns with default values
ALTER TABLE "Farmer" ADD COLUMN "experience" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Farmer" ADD COLUMN "farmSize" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Farmer" ADD COLUMN "cropTypes" TEXT[] NOT NULL DEFAULT '{}';

-- Then remove the default values
ALTER TABLE "Farmer" ALTER COLUMN "experience" DROP DEFAULT;
ALTER TABLE "Farmer" ALTER COLUMN "farmSize" DROP DEFAULT;
ALTER TABLE "Farmer" ALTER COLUMN "cropTypes" DROP DEFAULT;
