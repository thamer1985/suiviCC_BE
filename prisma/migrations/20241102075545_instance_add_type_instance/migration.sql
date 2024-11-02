-- AlterTable
ALTER TABLE `instance` ADD COLUMN `type` ENUM('Standard', 'Commission') NOT NULL DEFAULT 'Standard';

-- CreateIndex
CREATE INDEX `Cadre_MAT_PERS_idx` ON `Cadre`(`MAT_PERS`);
