/*
  Warnings:

  - You are about to drop the column `avatar` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `avatar`,
    ADD COLUMN `imageUrl` VARCHAR(255) NULL;
