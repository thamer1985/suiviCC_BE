import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaGeneralModule } from './prisma_general/prisma_general.module';
import { AuthModule } from './auth/auth.module';
import { DossierModule } from './dossier/dossier.module';
import { InstanceModule } from './instance/instance.module';
import { AgentModule } from './general/agent/agent.module';
import { CadreModule } from './cadre/cadre.module';
import { FileManagerModule } from './fileupload/filemanager..module';

@Module({
  imports: [PrismaModule, PrismaGeneralModule, AuthModule, DossierModule, InstanceModule, AgentModule, CadreModule, FileManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
