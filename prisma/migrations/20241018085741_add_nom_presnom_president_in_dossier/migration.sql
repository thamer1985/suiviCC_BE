/*
  Warnings:

  - Added the required column `nomPrenomPresident` to the `Dossier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dossier` ADD COLUMN `nomPrenomPresident` VARCHAR(191) NOT NULL;
