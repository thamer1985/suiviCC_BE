import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DossierService } from './dossier.service';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('dossier')
export class DossierController {
  constructor(private readonly dossierService: DossierService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDossierDto: CreateDossierDto) {
    return this.dossierService.create(createDossierDto);
  }

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDossierDto: UpdateDossierDto) {
    return this.dossierService.update(+id, updateDossierDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dossierService.remove(+id);
  }
}
