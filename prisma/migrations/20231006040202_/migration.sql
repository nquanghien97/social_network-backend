/*
  Warnings:

  - You are about to drop the column `expiration` on the `refreshtoken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `refreshtoken` DROP COLUMN `expiration`;
