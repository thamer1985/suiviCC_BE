import { Module } from '@nestjs/common';
import { DossierService } from './dossier.service';
import { DossierController } from './dossier.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DossierController],
  providers: [DossierService, PrismaService],
})
export class DossierModule {}
