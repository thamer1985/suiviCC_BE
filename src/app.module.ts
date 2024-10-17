import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaGeneralModule } from './prisma_general/prisma_general.module';
import { AuthModule } from './auth/auth.module';
import { DossierModule } from './dossier/dossier.module';
import { ProfilModule } from './profil/profil.module';
import { InstanceModule } from './instance/instance.module';

@Module({
  imports: [PrismaModule, PrismaGeneralModule, AuthModule, DossierModule, ProfilModule, InstanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
