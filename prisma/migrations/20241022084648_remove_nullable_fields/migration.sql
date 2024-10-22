/*
  Warnings:

  - Made the column `dateLimite` on table `chronologie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `delai` on table `instance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `chronologie` MODIFY `dateLimite` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `instance` MODIFY `delai` INTEGER NOT NULL;
