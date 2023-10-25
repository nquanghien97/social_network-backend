/*
  Warnings:

  - Added the required column `cloudinary_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `cloudinary_id` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `cloudinary` VARCHAR(255) NULL;
