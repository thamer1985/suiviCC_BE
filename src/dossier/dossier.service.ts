import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chronologie, Dossier, Instance, Prisma, TypeDossier, typeInstance } from '@prisma/client';
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

  async getDossiersByCadreAndType(matPresident: string, typeDossier: string,archived: boolean) {
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
            { type: typeDossierEnum,
              archive: archived
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
    }else{
       dossiers = await this.prismaService.dossier.findMany({
        where: {
          AND: [
            { type: typeDossierEnum ,archive:archived},
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
    Logger.debug("cadre", cadre);
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
  
    Logger.debug("dossiers:", dossiers);
  
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

  async create(createDossierDto: Prisma.DossierCreateInput) {
    const _libelle = createDossierDto.type == 'CCharges' ? 'رئيس لجنة كراس الشروط' : 'رئيس لجنة فرز العروض'
    
    const dossier= await this.prismaService.dossier.create({
      data: {
        ...createDossierDto,
        instance: {
          create: {
            libelle: _libelle,
            type: typeInstance.Commission,
            matPresident: createDossierDto.matPresident,
            delai: 30,
            rang: 0,
          }
        }
      },
      include: {
        instance: true,
        Chronologies:true
      }
    });
    await this.prismaService.chronologie.create({
      data: {
        idDossier: dossier.id,
        idInstance: dossier.instance.id,
        commentaire:"إنشاء ملف جديد",
        dateEnvoi: new Date(),
        dateLimite: dossier.dateLimite,
      }
    })
    return this.findOne(dossier.id);  
  }
  
  
  async patch(id: number, updateDossierDto: Prisma.DossierUpdateInput) {
    console.log(updateDossierDto);
    
    await this.prismaService.dossier.update({
      where:{
        id:id
      },
      data:updateDossierDto
    });
    return this.findOne(id);
  }
  // can Use Patch
  async updateLastChronologie(dossierId: number) {
    const lastChronologie = await this.prismaService.chronologie.findFirst({
      where: { idDossier: dossierId },
      orderBy: { dateEnvoi: 'desc' },
      include: {
        instance: true,
      } 
    });
    Logger.log(lastChronologie,"lastChronologie");
    
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
    const lastChronologie = await this.updateLastChronologie(dossierId);
    const dossier=await this.prismaService.dossier.findUnique({
      where: {
        id: dossierId,
      },include: {
        instance: true,
      } 
    })
    Logger.debug(dossier,"dossier");
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
            fromInstance:lastChronologie.instance.libelle
          },
        },
      },
      include: {
        Chronologies: true,
      }
    })

    //  await this.prismaService.dossier.update({
    //   where: {
    //     id: dossierId, 
    //   },
    //   data: {
    //     Chronologies: {
    //       create: {
    //         instance: {
    //           connect: {
    //             id: chronologie.idInstance, 
    //           },
    //         },
    //         // idInstance: chronologie.id, 
    //         dateEnvoi: chronologie.dateEnvoi,
    //         traite: false, 
    //         commentaire: chronologie.commentaire,
    //         dateLimite: chronologie.dateLimite,
    //       },
    //     },
    //   },
    //   include: {
    //     Chronologies: true,
    //     // Instance: true, 
    //   },
    // })
    return this.findOne(dossierId);
      
    }

  remove(id: number) {
    return `This action removes a #${id} dossier`;
  }
}
