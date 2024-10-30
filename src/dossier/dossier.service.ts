import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chronologie, Dossier, Instance, Prisma, TypeDossier } from '@prisma/client';
import { log } from 'console';

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

  async findAllByInstanceByType(type: string, instanceId: number) {
     // Convert the string to the enum type
     const enumType = TypeDossier[type as keyof typeof TypeDossier]; 
    
     if (!enumType) {
       throw new Error(`Invalid type provided: ${type}`);
     }
   
     const dossiers = await this.prismaService.instance.findUnique({
      where: {
        id: Number(instanceId)
      },
      include: {
        Chronologies: {
          where:{
            dossier: {
                type:enumType
            }
          },
          include: {
            dossier:true
          }
        }
      }
    }).then(instance => 
      instance?.Chronologies
        .map(chronologie => chronologie.dossier)
        .filter(dossier => dossier !== null)
    );

    return dossiers;
     
  }

  async getDossiersByCadreAndType(matPresident: string, typeDossier: string) {
    const typeDossierEnum = TypeDossier[typeDossier as keyof typeof TypeDossier];
    let dossiers:Dossier[];
    if (!typeDossierEnum) {
      throw new BadRequestException('Invalid typeDossier');
    }
    // To Remove
    if(matPresident=="195379"){
      dossiers = await this.prismaService.dossier.findMany({
        where: {
          AND: [
            { type: typeDossierEnum },
          ],
        },
        include: {
          Chronologies: {
            orderBy: {
              dateEnvoi: 'asc',
            }
          },
        },
        });
    }else{
       dossiers = await this.prismaService.dossier.findMany({
        where: {
          AND: [
            { type: typeDossierEnum },
            {
              matPresident: matPresident
            },
          ],
        },
        include: {
          Chronologies: {
            orderBy: {
              dateEnvoi: 'asc',
            }
          },
        },
        });
    }
    
    return dossiers;
  }
  // async getDossiersForCadreGroupedByInstance(idCadre: number, typeDossier: string) {
  //   const typeDossierEnum = TypeDossier[typeDossier as keyof typeof TypeDossier];
    
  //   if (!typeDossierEnum) {
  //     throw new BadRequestException('Invalid typeDossier');
  //   }
  //   const dossiers = await this.prismaService.dossier.findMany({
  //     where: {
  //       AND: [
  //         { type: typeDossierEnum },
  //         {
  //           Chronologies: {
  //             some: {
  //               instance: {
  //                 membres: {
  //                   some: { idCadre },
  //                 },
  //               }
  //             },
  //           },
  //         },
  //       ],
  //     },
  //     include: {
  //       Chronologies: {
  //         orderBy: {
  //           dateEnvoi: 'asc',
  //         }
  //       },
  //     },
  //   });
  //   // Group dossiers by instance
  //   Logger.debug(dossiers);
    

  //   const groupedByInstance = dossiers.reduce((groups, dossier) => {
  //     dossier.Chronologies.forEach((chronologie) => {
  //       const instanceId = chronologie.idInstance;
  //       if (!groups[instanceId]) {
  //         groups[instanceId] = {
  //           instanceId: chronologie.idInstance,
  //           dossiers: [],
  //         };
  //       }
  //       // Only add the dossier once per instance
  //       if (!groups[instanceId].dossiers.find(d => d.id === dossier.id)) {
  //         if(!chronologie.traite){
  //           groups[instanceId].dossiers.push(dossier);
  //         }
  //       }
  //     });
  //     return groups;
  //   }, {});

  //   return Object.values(groupedByInstance);
  // }

  async getDossiersForCadreGroupedByInstance(matricule: string, typeDossier: string) {
    const typeDossierEnum = TypeDossier[typeDossier as keyof typeof TypeDossier];
  
    if (!typeDossierEnum) {
      throw new BadRequestException('Invalid typeDossier');
    }
    const cadre = await this.prismaService.cadre.findFirst({
      where: {
        MAT_PERS: { startsWith:matricule}
      },
      select: {
        id: true,
      }
    });
    Logger.debug(cadre);
    const idCadre = cadre.id;
    const dossiers = await this.prismaService.dossier.findMany({
      where: {
        AND: [
          { type: typeDossierEnum },
          {
            Chronologies: {
              some: {
                traite: false,
                instance: {
                  membres: {
                    some: { idCadre: idCadre },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        Chronologies: {
          orderBy: {
            dateEnvoi: 'asc',
          },
          where: {
            traite: false,
          },
        },
      },
    });
  
    Logger.debug(dossiers);
  
    const groupedByInstance = dossiers.reduce((groups, dossier) => {
      dossier.Chronologies.forEach((chronologie) => {
        const instanceId = chronologie.idInstance;
        if (!groups[instanceId]) {
          groups[instanceId] = {
            instanceId: chronologie.idInstance,
            dossiers: [],
          };
        }
        if (!groups[instanceId].dossiers.find(d => d.id === dossier.id)) {
          groups[instanceId].dossiers.push(dossier);
        }
      });
      return groups;
    }, {});
  
    return Object.values(groupedByInstance);
  }
  // async getDossiersForCadreGroupedByInstance(idCadre: number, typeDossier: string) {
  //   const typeDossierEnum = TypeDossier[typeDossier as keyof typeof TypeDossier];
  
  //   if (!typeDossierEnum) {
  //     throw new BadRequestException('Invalid typeDossier');
  //   }
  
  //   const query = `
  //     SELECT d.*, c.id as cadreId, ch.idInstance
  //     FROM dossier d
  //     LEFT JOIN chronologie ch ON ch.idDossier = d.id
  //     LEFT JOIN instance i ON i.id = ch.idInstance
  //     LEFT JOIN membre m ON i.id = m.idInstance
  //     LEFT JOIN cadre c ON c.id = m.idCadre
  //     WHERE c.id = ${idCadre} AND ch.traite = 0 AND d.type = '${typeDossier}'
  //   `;
  
  //   const dossiers = await this.prismaService.$queryRawUnsafe<any>(query);
  
  //   Logger.debug(dossiers);
  
  //   const groupedByInstance = dossiers.reduce((groups: any, dossier: any) => {
  //     const instanceId = dossier.idInstance;
  //     if (!groups[instanceId]) {
  //       groups[instanceId] = {
  //         instanceId: dossier.idInstance,
  //         dossiers: [],
  //       };
  //     }
  //     if (!groups[instanceId].dossiers.find((d: any) => d.id === dossier.id)) {
  //       groups[instanceId].dossiers.push(dossier);
  //     }
  //     return groups;
  //   }, {});
  
  //   return Object.values(groupedByInstance);
  // }
  

  async findOne(id: number) {
    return await this.prismaService.dossier.findUnique({
      where:{
        id:id
      },
      include:{
        Chronologies:{
          orderBy:{dateEnvoi:'asc'},
          include:{instance:true}
        }
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
  async updateLastChronologie(dossierId: number) {
    const lastChronologie = await this.prismaService.chronologie.findFirst({
      where: { idDossier: dossierId },
      orderBy: { dateEnvoi: 'desc' }, 
    });
    
    if (lastChronologie) {
      await this.prismaService.chronologie.update({
        where: { id: lastChronologie.id },
        data: { traite: true },
      });
    }

    return lastChronologie;
  }
  async send(dossierId: number, chronologie: Chronologie) {
    console.log(chronologie);
    await this.updateLastChronologie(dossierId);

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
