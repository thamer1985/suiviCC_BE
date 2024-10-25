/*
  Warnings:

  - You are about to drop the column `idProfil` on the `membre` table. All the data in the column will be lost.
  - You are about to drop the `profil` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idCadre` to the `Membre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `membre` DROP FOREIGN KEY `Membre_idProfil_fkey`;

-- AlterTable
ALTER TABLE `membre` DROP COLUMN `idProfil`,
    ADD COLUMN `idCadre` INTEGER NOT NULL;

-- DropTable
DROP TABLE `profil`;

-- CreateTable
CREATE TABLE `Cadre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `MAT_PERS` VARCHAR(6) NOT NULL,
    `NOM_PERS` VARCHAR(45) NOT NULL,
    `NOM_PERS_A` VARCHAR(45) NOT NULL,
    `COD_CLASS` VARCHAR(2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Membre` ADD CONSTRAINT `Membre_idCadre_fkey` FOREIGN KEY (`idCadre`) REFERENCES `Cadre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
