/*
  Warnings:

  - The primary key for the `refreshtoken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avavar` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `refreshtoken` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `avavar`,
    ADD COLUMN `avatar` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `RefreshToken_id_key` ON `RefreshToken`(`id`);
