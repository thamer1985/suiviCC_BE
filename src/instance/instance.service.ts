import { Injectable } from '@nestjs/common';
import { Membre, Prisma, typeInstance } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstanceService {
  constructor(
    private prismaService: PrismaService
  ) {}

  create(createInstanceDto: Prisma.InstanceCreateInput) {
    return this.prismaService.instance.create({
      data: createInstanceDto
    })}

  findAll() {
    return this.prismaService.instance.findMany({
      orderBy: {
        type: 'desc',
      },
    });

  }
  async getFiltredInstancestoSend(dossierId: number) {
    const instances = await this.prismaService.instance.findMany({
      where: {
        OR: [
         { dossier: {
            id: dossierId
          }
        },
        { type: typeInstance.Standard }
        ]
      },
      orderBy: {
        rang: 'asc',
        
      },
    });
return instances;

  }
  findAllStandardInstance() {
    return this.prismaService.instance.findMany({
      where: {
        type: typeInstance.Standard
      
      },
      orderBy: {
        rang: 'asc',
        
      },
      });
  }
  findAllCommisionInstance() {
    return this.prismaService.instance.findMany({
      where: {
        type: typeInstance.Commission
      }
      });
  }

  findOne(id: number) {
    
    return this.prismaService.instance.findUnique({
      where: {
        id: id
      }
    })
  }

  // patch(id: number, updateInstanceDto: Prisma.InstanceUpdateInput) {
  //   const membres=updateInstanceDto.membres;
  //   console.log(membres);
    
  //   return this.prismaService.instance.update({
  //     where: {
  //       id: id
  //     },
  //     data: updateInstanceDto 
  //   })
  // }
  // patch(id: number, updateInstanceDto: Prisma.InstanceUpdateInput) {
  //   const membres=updateInstanceDto.membres as Membre[];
  //   const listIds=membres.map(membre => membre.id);
  //   console.log(listIds);
    
  //   return this.prismaService.instance.update({
  //     where: {
  //       id: id
  //     },data: {
  //       libelle: updateInstanceDto.libelle, // Optional: update other fields if needed
  //       rang: updateInstanceDto.rang,
  //       delai: updateInstanceDto.delai,
  //       membres: {
  //         create: listIds.map(_id => ({
  //           cadre: {
  //             connect: { id: _id }
  //           }
  //         }))
  //       }
  //     },
  //     include: {
  //       membres: true
  //     } 
  //   })
  // }


  async patch(id: number, updateInstanceDto: Prisma.InstanceUpdateInput) {
    const membres = updateInstanceDto.membres as Membre[];
    const listIds = membres.map(membre => membre.id);
    console.log(listIds);
  
    return this.prismaService.instance.update({
      where: {
        id: id
      },
      data: {
        libelle: updateInstanceDto.libelle, // Optional: update other fields if needed
        rang: updateInstanceDto.rang,
        delai: updateInstanceDto.delai,
        membres: {
          // Connect existing membres or create new ones
          connectOrCreate: listIds.map(_id => ({
            where: {
              idCadre_idInstance: {
                idCadre: _id,
                idInstance: id
              }
            },
            create: {
              cadre: {
                connect: { id: _id }
              }
            }
          }))
        }
      },
      include: {
        membres: true
      }
    });
  }



  async removeMemberFromInstance(idInstance: number, idCadre: number) {
    const result = await this.prismaService.membre.deleteMany({
      where: {
        idInstance: idInstance,
        idCadre: idCadre,
      },
    });
    if(result)
        {
          const instance = await this.prismaService.instance.findUnique({
            where: {
              id: idInstance
            } , include: {
              membres: true
            }
          });
          return instance;
        }
        else throw new Error('Member not found');    
  }
  
  remove(id: number) {
    return `This action removes a #${id} instance`;
  }
}
