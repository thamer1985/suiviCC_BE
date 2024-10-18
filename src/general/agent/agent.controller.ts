import { Controller, Get, Param } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get(':matriule')
  findOne(@Param('matriule') matriule: string) {
    return this.agentService.findOne(matriule);
  }
}
