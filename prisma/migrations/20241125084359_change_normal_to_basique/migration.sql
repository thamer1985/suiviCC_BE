/*
  Warnings:

  - You are about to alter the column `importance` on the `dossier` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(1))`.
  - Made the column `delai` on table `instance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `dossier` MODIFY `importance` ENUM('Basique', 'Important', 'TresImportant', 'Vital') NOT NULL DEFAULT 'Basique';

-- AlterTable
ALTER TABLE `instance` MODIFY `delai` INTEGER NOT NULL;
