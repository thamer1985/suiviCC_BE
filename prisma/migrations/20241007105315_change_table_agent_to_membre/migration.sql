/*
  Warnings:

  - You are about to drop the `agent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `agent` DROP FOREIGN KEY `agent_idInstance_fkey`;

-- DropForeignKey
ALTER TABLE `agent` DROP FOREIGN KEY `agent_idProfil_fkey`;

-- DropTable
DROP TABLE `agent`;

-- CreateTable
CREATE TABLE `Membre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idProfil` INTEGER NOT NULL,
    `idInstance` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Membre` ADD CONSTRAINT `Membre_idProfil_fkey` FOREIGN KEY (`idProfil`) REFERENCES `Profil`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Membre` ADD CONSTRAINT `Membre_idInstance_fkey` FOREIGN KEY (`idInstance`) REFERENCES `Instance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
