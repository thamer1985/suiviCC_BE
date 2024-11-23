-- AlterTable
ALTER TABLE `dossier` ADD COLUMN `matCreateur` VARCHAR(191) NULL,
    MODIFY `type` ENUM('CCharges', 'Depouillement', 'Contrat') NOT NULL DEFAULT 'CCharges';

-- AlterTable
ALTER TABLE `instance` ADD COLUMN `delaiImportant` INTEGER NULL,
    ADD COLUMN `delaiTresImportant` INTEGER NULL,
    ADD COLUMN `delaiVital` INTEGER NULL,
    MODIFY `delai` INTEGER NULL;
