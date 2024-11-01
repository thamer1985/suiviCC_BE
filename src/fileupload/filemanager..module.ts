import { Module } from '@nestjs/common';
import { FileManagerService } from './filemanager..service';
import { FileManagerController } from './filemanager.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [FileManagerService,PrismaService],
  controllers: [FileManagerController]
})
export class FileManagerModule {}
