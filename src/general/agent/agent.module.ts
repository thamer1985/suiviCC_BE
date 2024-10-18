import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { PrismaGeneralService } from 'src/prisma_general/prisma_general.service';

@Module({
  controllers: [AgentController],
  providers: [AgentService,PrismaGeneralService],
})
export class AgentModule {}
