import { Module } from '@nestjs/common';
import { InstanceService } from './instance.service';
import { InstanceController } from './instance.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [InstanceController],
  providers: [InstanceService,PrismaService],
})
export class InstanceModule {}
