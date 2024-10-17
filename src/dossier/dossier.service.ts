import { Injectable } from '@nestjs/common';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TypeDossier } from '@prisma/client';

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
        Chronologies:true
      }
    });
  }
  async findAllByType(type: string) {
    // Convert the string to the enum type
    const enumType = TypeDossier[type as keyof typeof TypeDossier]; 
    
    if (!enumType) {
      throw new Error(`Invalid type provided: ${type}`);
    }
  
    return await this.prismaService.dossier.findMany({
      where: {
        type: enumType, // Use the converted enum type
      },
      include: {
        Chronologies: true,
      },
    });
  }


  async findOne(id: number) {
    return await this.prismaService.dossier.findUnique({
      where:{
        id:id
      },
      include:{
        Chronologies:{include:{instance:true}}
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
