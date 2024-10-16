import { Module } from '@nestjs/common';
import { ProfilService } from './profil.service';
import { ProfilController } from './profil.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProfilController],
  providers: [ProfilService , PrismaService],
})
export class ProfilModule {}
