import { Module } from '@nestjs/common';
import { DossierService } from './dossier.service';
import { DossierController } from './dossier.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaGeneralService } from 'src/prisma_general/prisma_general.service';

@Module({
  controllers: [DossierController],
  providers: [DossierService, PrismaService,PrismaGeneralService],
})
export class DossierModule {}
