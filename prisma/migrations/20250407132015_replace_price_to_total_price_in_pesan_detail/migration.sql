/*
  Warnings:

  - Added the required column `totalPrice` to the `PesanDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PesanDetail" ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;
