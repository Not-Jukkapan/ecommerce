/*
  Warnings:

  - You are about to drop the column `line` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.
  - Added the required column `lineOne` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_productId_fkey`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `line`,
    ADD COLUMN `lineOne` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `productId`,
    DROP COLUMN `quantity`,
    ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE FULLTEXT INDEX `products_name_description_tags_idx` ON `products`(`name`, `description`, `tags`);
