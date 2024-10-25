import { Module } from '@nestjs/common';
import { CadreService } from './cadre.service';
import { CadreController } from './cadre.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CadreController],
  providers: [CadreService,PrismaService],
})
export class CadreModule {}
