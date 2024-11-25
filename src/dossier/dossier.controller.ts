import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DossierService } from './dossier.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Chronologie, Prisma } from '@prisma/client';
import { RolesGuard } from 'src/auth/role.guard';
import { UserRole } from 'src/auth/constants';
import { Roles } from 'src/auth/roles.decorator';
@UseGuards(JwtAuthGuard)
@Controller('dossier')
export class DossierController {
  constructor(private readonly dossierService: DossierService) {}
  
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.Admin)
  @Get()
  findAll() {
    return this.dossierService.findAll();
  }

  @Get('count/matricule/:matricule')
  CountAllByMatricule(@Param('matricule') matricule: string) {
    return this.dossierService.countAllByMatricule(matricule);
  }
  @Get('dg/count/matricule/:matricule')
  CountAllByMatriculeForDG(@Param('matricule') matricule: string) {
    return this.dossierService.CountAllByMatriculeForDG(matricule);
  }
  @Get('admin/count/matCreateur/:matCreateur')
  CountAllByMatriculeForAdmin(@Param('matCreateur') matCreateur: string) {
    return this.dossierService.CountAllByMatriculeForAdmin(matCreateur);
  }
  
  @Get('type/:type')
  findAllByType(@Param('type') type: string) {
    return this.dossierService.findAllByType(type);
  }
  // @Get('instance/:instanceId/type/:type')
  // findAllByInstanceByType(@Param('type') type: string, @Param('instanceId') instanceId: string) {
  //   return this.dossierService.findAllByInstanceByType(type, +instanceId);
  // }
  @UseGuards(RolesGuard)
  // @Roles(UserRole.User)
  @Get('instance/matricule/:matricule/type/:type')
  getDossiersForCadreGroupedByInstance(@Param('type') type: string, @Param('matricule') matricule: string) {
    return this.dossierService.getDossiersForCadreGroupedByInstance(matricule,type );
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin,UserRole.SysAdmin,UserRole.DG)
  @Get('dg/type/:type/archived/:archived')
  getAllDossiersByType(@Param('type') type: string, @Param('archived') archived: string) {
   const _archived = archived == 'true' ? true : false
    return this.dossierService.getAllDossiersByType(type,_archived );
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @Get('admin/matCreateur/:matCreateur/type/:type/archived/:archived')
  getAdminDossiersByType(@Param('type') type: string, @Param('matCreateur') matCreateur: string, @Param('archived') archived: string) {
   const _archived = archived == 'true' ? true : false
    return this.dossierService.getAdminDossiersByType(matCreateur,type,_archived );
  }
  @Get('matPresident/:matPresident/type/:type/archived/:archived')
  getDossiersByCadreAndType(@Param('type') type: string, @Param('matPresident') matPresident: string, @Param('archived') archived: string) {
   const _archived = archived == 'true' ? true : false
    return this.dossierService.getDossiersByCadreAndType(matPresident,type,_archived );
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

  @UseGuards(RolesGuard)
  @Roles(UserRole.SysAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dossierService.remove(+id);
  }
}
