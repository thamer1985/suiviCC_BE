/*
  Warnings:

  - You are about to drop the `situationdossier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `situationdossier` DROP FOREIGN KEY `SituationDossier_idDossier_fkey`;

-- DropForeignKey
ALTER TABLE `situationdossier` DROP FOREIGN KEY `SituationDossier_idInstance_fkey`;

-- DropTable
DROP TABLE `situationdossier`;

-- CreateTable
CREATE TABLE `Chronologie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idDossier` INTEGER NOT NULL,
    `idInstance` INTEGER NOT NULL,
    `dateEnvoi` DATETIME(3) NULL,
    `traite` BOOLEAN NOT NULL DEFAULT false,
    `commentaire` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chronologie` ADD CONSTRAINT `Chronologie_idDossier_fkey` FOREIGN KEY (`idDossier`) REFERENCES `Dossier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chronologie` ADD CONSTRAINT `Chronologie_idInstance_fkey` FOREIGN KEY (`idInstance`) REFERENCES `Instance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
