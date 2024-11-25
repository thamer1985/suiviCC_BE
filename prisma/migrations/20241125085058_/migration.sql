-- AlterTable
ALTER TABLE `dossier` MODIFY `importance` ENUM('Basique', 'Important', 'TresImportant', 'Vital') NULL DEFAULT 'Basique';
