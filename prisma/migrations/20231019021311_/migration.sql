/*
  Warnings:

  - You are about to drop the column `parentCommentId` on the `comments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_parentCommentId_fkey`;

-- AlterTable
ALTER TABLE `comments` DROP COLUMN `parentCommentId`,
    ADD COLUMN `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Comments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
