/*
  Warnings:

  - A unique constraint covering the columns `[idCadre,idInstance]` on the table `Membre` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Membre_idCadre_idInstance_key` ON `Membre`(`idCadre`, `idInstance`);
