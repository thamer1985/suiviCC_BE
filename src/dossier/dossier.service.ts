import { Injectable } from '@nestjs/common';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DossierService {

  constructor(
    private prismaService: PrismaService
  ) {}
  create(createDossierDto: CreateDossierDto) {
    return 'This action adds a new dossier';
  }

  async findAll() {
    return await this.prismaService.dossier.findMany({
      include:{
        SituationDossier:true
      }
    });
  }

  async findOne(id: number) {
    return await this.prismaService.dossier.findUnique({
      where:{
        id:id
      },
      include:{
        SituationDossier:true
      }
    });
  }

  update(id: number, updateDossierDto: UpdateDossierDto) {
    return `This action updates a #${id} dossier`;
  }

  remove(id: number) {
    return `This action removes a #${id} dossier`;
  }
}
