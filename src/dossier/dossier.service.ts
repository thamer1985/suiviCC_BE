import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chronologie, Prisma, TypeDossier } from '@prisma/client';

@Injectable()
export class DossierService {
  

  constructor(
    private prismaService: PrismaService
  ) {}
 

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

  create(createDossierDto: Prisma.DossierCreateInput) {
    return this.prismaService.dossier.create({data:createDossierDto});
  }
  
  patch(id: number, updateDossierDto: Prisma.DossierUpdateInput) {
    console.log(updateDossierDto);
    
    return this.prismaService.dossier.update({
      where:{
        id:id
      },
      data:updateDossierDto
    });
  }
  // can Use Patch

  async send(dossierId: number, chronologie: Chronologie) {
    console.log(chronologie);
    
     await this.prismaService.dossier.update({
      where: {
        id: dossierId, 
      },
      data: {
        Chronologies: {
          create: {
            instance: {
              connect: {
                id: chronologie.idInstance, 
              },
            },
            // idInstance: chronologie.id, 
            dateEnvoi: chronologie.dateEnvoi,
            traite: false, 
            commentaire: chronologie.commentaire,
            dateLimite: chronologie.dateLimite,
          },
        },
      },
      include: {
        Chronologies: true,
        // Instance: true, 
      },
    })
    return await this.prismaService.dossier.findFirst({
      where: {
        id: dossierId, 
      },
      include: {
        Chronologies: {
          include: {
            instance: true,},
        },
      }
    })
      
    }

  remove(id: number) {
    return `This action removes a #${id} dossier`;
  }
}
