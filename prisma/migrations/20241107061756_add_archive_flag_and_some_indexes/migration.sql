-- AlterTable
ALTER TABLE `dossier` ADD COLUMN `archive` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Chronologie_id_idx` ON `Chronologie`(`id`);

-- CreateIndex
CREATE INDEX `Dossier_id_type_archive_idx` ON `Dossier`(`id`, `type`, `archive`);

-- CreateIndex
CREATE INDEX `Instance_id_type_idx` ON `Instance`(`id`, `type`);
