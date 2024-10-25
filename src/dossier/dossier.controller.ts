import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DossierService } from './dossier.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Chronologie, Prisma } from '@prisma/client';

@Controller('dossier')
export class DossierController {
  constructor(private readonly dossierService: DossierService) {}

  // @UseGuards(JwtAuthGuard)
 

  //@UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.dossierService.findAll();
  }
  @Get('type/:type')
  findAllByType(@Param('type') type: string) {
    return this.dossierService.findAllByType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dossierService.findOne(+id);
  }

  @Post()
  create(@Body() createDossierDto: Prisma.DossierCreateInput) {
    return this.dossierService.create(createDossierDto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateDossierDto: Prisma.DossierUpdateInput) {
    return this.dossierService.patch(+id, updateDossierDto);
  }
  @Patch('send/:id')
  send(@Param('id') id: string, @Body() chronologie: Chronologie) {
    return this.dossierService.send(+id, chronologie);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dossierService.remove(+id);
  }
}
