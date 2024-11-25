/*
  Warnings:

  - Made the column `importance` on table `dossier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `dossier` MODIFY `importance` ENUM('Basique', 'Important', 'TresImportant', 'Vital') NOT NULL DEFAULT 'Basique';
