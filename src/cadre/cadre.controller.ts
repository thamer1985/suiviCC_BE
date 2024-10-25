import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CadreService } from './cadre.service';
import { Prisma } from '@prisma/client';

@Controller('cadre')
export class CadreController {
  constructor(private readonly cadreService: CadreService) {}

  @Post()
  create(@Body() createCadreDto: Prisma.CadreCreateInput) {
    return this.cadreService.create(createCadreDto);
  }

  @Get()
  findAll() {
    return this.cadreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cadreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCadreDto: Prisma.CadreUpdateInput) {
    return this.cadreService.update(+id, updateCadreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cadreService.remove(+id);
  }
}
