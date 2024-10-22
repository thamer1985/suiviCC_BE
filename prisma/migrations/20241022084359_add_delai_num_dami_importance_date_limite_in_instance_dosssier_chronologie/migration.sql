-- AlterTable
ALTER TABLE `chronologie` ADD COLUMN `dateLimite` DATETIME(3) NULL,
    MODIFY `commentaire` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `dossier` ADD COLUMN `importance` ENUM('Normal', 'Important', 'TresImportant', 'Vital') NOT NULL DEFAULT 'Normal',
    ADD COLUMN `numDami` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `instance` ADD COLUMN `delai` INTEGER NULL;
