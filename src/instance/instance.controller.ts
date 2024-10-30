import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InstanceService } from './instance.service';
import { Prisma } from '@prisma/client';

@Controller('instance')
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}

  @Post()
  create(@Body() createInstanceDto: Prisma.InstanceCreateInput) {
    return this.instanceService.create(createInstanceDto);
  }

  @Get()
  findAll() {
    return this.instanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstanceDto: Prisma.InstanceUpdateInput) {
    return this.instanceService.patch(+id, updateInstanceDto);
  }

  @Get('idInstance/:idInstance/idCadre/:idCadre')
  removeMemberFromInstance(@Param('idInstance') idInstance: string, @Param('idCadre') idCadre: string) {
    return this.instanceService.removeMemberFromInstance(+idInstance, +idCadre);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instanceService.remove(+id);
  }
}
