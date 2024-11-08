-- DropForeignKey
ALTER TABLE `dossier` DROP FOREIGN KEY `Dossier_instanceId_fkey`;

-- AddForeignKey
ALTER TABLE `Dossier` ADD CONSTRAINT `Dossier_instanceId_fkey` FOREIGN KEY (`instanceId`) REFERENCES `Instance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
