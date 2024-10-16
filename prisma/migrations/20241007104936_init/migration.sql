-- CreateTable
CREATE TABLE `Dossier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('CC', 'DP') NOT NULL,
    `sujet` LONGTEXT NOT NULL,
    `numeroCc` VARCHAR(191) NULL,
    `numeroDp` VARCHAR(191) NULL,
    `dateOrdre` DATETIME(3) NOT NULL,
    `dateDp` DATETIME(3) NULL,
    `matPresident` INTEGER NOT NULL,
    `delai` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Instance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `rang` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SituationDossier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idDossier` INTEGER NOT NULL,
    `idInstance` INTEGER NOT NULL,
    `dateEnvoi` DATETIME(3) NULL,
    `commentaire` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricule` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idProfil` INTEGER NOT NULL,
    `idInstance` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SituationDossier` ADD CONSTRAINT `SituationDossier_idDossier_fkey` FOREIGN KEY (`idDossier`) REFERENCES `Dossier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SituationDossier` ADD CONSTRAINT `SituationDossier_idInstance_fkey` FOREIGN KEY (`idInstance`) REFERENCES `Instance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agent` ADD CONSTRAINT `agent_idProfil_fkey` FOREIGN KEY (`idProfil`) REFERENCES `Profil`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agent` ADD CONSTRAINT `agent_idInstance_fkey` FOREIGN KEY (`idInstance`) REFERENCES `Instance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
