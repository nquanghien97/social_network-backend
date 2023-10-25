/*
  Warnings:

  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_postId_fkey`;

-- AlterTable
ALTER TABLE `comments` MODIFY `postId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
