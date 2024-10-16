/*
  Warnings:

  - You are about to drop the column `dateDp` on the `dossier` table. All the data in the column will be lost.
  - You are about to drop the column `dateOrdre` on the `dossier` table. All the data in the column will be lost.
  - You are about to drop the column `delai` on the `dossier` table. All the data in the column will be lost.
  - You are about to drop the column `numeroCc` on the `dossier` table. All the data in the column will be lost.
  - You are about to drop the column `numeroDp` on the `dossier` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `dossier` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - You are about to drop the column `createdAt` on the `instance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `instance` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `profil` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `profil` table. All the data in the column will be lost.
  - Added the required column `dateLettre` to the `Dossier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateLimite` to the `Dossier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dossier` DROP COLUMN `dateDp`,
    DROP COLUMN `dateOrdre`,
    DROP COLUMN `delai`,
    DROP COLUMN `numeroCc`,
    DROP COLUMN `numeroDp`,
    ADD COLUMN `dateLettre` DATETIME(3) NOT NULL,
    ADD COLUMN `dateLimite` DATETIME(3) NOT NULL,
    ADD COLUMN `dateLimiteOffres` DATETIME(3) NULL,
    ADD COLUMN `numeroDossier` VARCHAR(191) NULL,
    MODIFY `type` ENUM('CCharges', 'Depouillement') NOT NULL DEFAULT 'CCharges',
    MODIFY `matPresident` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `instance` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `profil` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `situationdossier` ADD COLUMN `traite` BOOLEAN NOT NULL DEFAULT false;
