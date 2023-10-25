/*
  Warnings:

  - You are about to drop the column `cloudinary` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `cloudinary`,
    ADD COLUMN `cloudinary_id` VARCHAR(255) NULL;
