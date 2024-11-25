/*
  Warnings:

  - Made the column `matCreateur` on table `dossier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `dossier` MODIFY `matCreateur` VARCHAR(191) NOT NULL;
