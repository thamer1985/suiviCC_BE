/*
  Warnings:

  - A unique constraint covering the columns `[instanceId]` on the table `Dossier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `dossier` ADD COLUMN `instanceId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Dossier_instanceId_key` ON `Dossier`(`instanceId`);

-- AddForeignKey
ALTER TABLE `Dossier` ADD CONSTRAINT `Dossier_instanceId_fkey` FOREIGN KEY (`instanceId`) REFERENCES `Instance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
