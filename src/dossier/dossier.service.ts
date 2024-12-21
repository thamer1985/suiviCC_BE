import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chronologie, Dossier, Instance, Prisma, TypeDossier, typeInstance } from '@prisma/client';
import { count, countReset, log } from 'console';
import { PrismaGeneralService } from 'src/prisma_general/prisma_general.service';
import { UserRole } from 'src/auth/constants';
export interface CountResult{
  matricule:string,
  ccEncours:number,
  depEncours:number,
  ccInstance:number,
  depInstance:number,
  ccHorsDL:number,
  depHorsDL:number

};
type DossierWithChronologies = Prisma.DossierGetPayload<{
  include: { Chronologies: true; instance: true }
}>;

const importanceOrder = ['Normal', 'Important', 'TresImportant', 'Vital'];

@Injectable()
export class DossierService {
 

  constructor(
    private prismaService: PrismaService,private prismaGeneralService: PrismaGeneralService
  ) {}
 

  async findAll() {
    return await this.prismaService.dossier.findMany({
      include:{
        Chronologies:true
      }
    });
  }
  async countAllByMatricule(matricule:string) {
    let countResult={} as CountResult;

    countResult.ccEncours = await this.prismaService.dossier.count({
      where: {
        AND: [
          { 
            matPresident: matricule,
            type: TypeDossier.CCharges,
            archive: false
           },
        ],
      }
      });
      countResult.depEncours = await this.prismaService.dossier.count({
      where: {
        AND: [
          { 
            matPresident: matricule,
            type: TypeDossier.Depouillement,
            archive: false
           },
        ],
      }
      });

      const today = new Date();
      let cc=0;
      const ccList = await this.prismaService.dossier.findMany({
        where: {
          matPresident: matricule,
          type: TypeDossier.CCharges,
          archive: false,
        },
        select: {
          Chronologies: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });
      ccList.forEach(dossier => {
        const lastChronologie = dossier.Chronologies[0];        
        if (lastChronologie && lastChronologie.dateLimite < today) {
          cc++;
        }
      });

      Logger.debug("cc", cc);
      countResult.ccHorsDL=cc;
      
      

      let dep=0;
      const depList = await this.prismaService.dossier.findMany({
        where: {
          matPresident: matricule,
          type: TypeDossier.Depouillement,
          archive: false,
        },
        include: {
          Chronologies: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });
      depList.forEach(dossier => {
        const lastChronologie = dossier.Chronologies[0];        
        if (lastChronologie && lastChronologie.dateLimite < today) {
          dep++;
        }
      });

      Logger.debug("dep", dep);
      countResult.depHorsDL=dep;

      // Instance

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
      countResult.ccInstance = await this.prismaService.dossier.count({
        where: {
          AND: [
            { type: TypeDossier.CCharges, archive: false },
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
        }
      });

      countResult.depInstance = await this.prismaService.dossier.count({
        where: {
          AND: [
            { type: TypeDossier.Depouillement, archive: false },
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
        }
      });
    

        
      Logger.debug("result: ", countResult);
      return countResult;
      
  }
  async CountAllByMatriculeForAdmin(matCreateur:string) {
    let countResult={} as CountResult;

    countResult.ccEncours = await this.prismaService.dossier.count({
      where: {
        AND: [
          { 
            type: TypeDossier.CCharges,
            archive: false
           },
           {
            OR: [
              {matCreateur: matCreateur},
              {matPresident: matCreateur},
            ]
          }
        ],
      }
      });
      countResult.depEncours = await this.prismaService.dossier.count({
      where: {
        AND: [
          { 
            type: TypeDossier.Depouillement,
            archive: false
           },
            {
              OR: [
                {matCreateur: matCreateur},
                {matPresident: matCreateur},
              ]
            }
        ],
      }
      });
            const today = new Date();
      let cc=0;
      const ccList = await this.prismaService.dossier.findMany({
        where: {
          OR: [
            {matCreateur: matCreateur},
            {matPresident: matCreateur},
          ],
          type: TypeDossier.CCharges,
          archive: false,
        },
        select: {
          Chronologies: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });
      ccList.forEach(dossier => {
        const lastChronologie = dossier.Chronologies[0];        
        if (lastChronologie && lastChronologie.dateLimite < today) {
          cc++;
        }
      });

      Logger.debug("cc", cc);
      countResult.ccHorsDL=cc;
      
      

      let dep=0;
      const depList = await this.prismaService.dossier.findMany({
        where: {
          OR: [
            {matCreateur: matCreateur},
            {matPresident: matCreateur},
          ],
          type: TypeDossier.Depouillement,
          archive: false,
        },
        include: {
          Chronologies: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });
      depList.forEach(dossier => {
        const lastChronologie = dossier.Chronologies[0];        
        if (lastChronologie && lastChronologie.dateLimite < today) {
          dep++;
        }
      });

      Logger.debug("dep", dep);
      countResult.depHorsDL=dep;

      const cadre = await this.prismaService.cadre.findFirst({
        where: {
          MAT_PERS: { startsWith:matCreateur}
        },
        select: {
          id: true,
        }
      });
      Logger.debug("cadre", cadre);
      const idCadre = cadre.id;
      countResult.ccInstance = await this.prismaService.dossier.count({
        where: {
          AND: [
            { type: TypeDossier.CCharges, archive: false },
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
        }
      });

      countResult.depInstance = await this.prismaService.dossier.count({
        where: {
          AND: [
            { type: TypeDossier.Depouillement, archive: false },
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
        }
      });
    

        
      Logger.debug("result: ", countResult);
      return countResult;
      
  }
  async CountAllByMatriculeForDG(matricule:string) {
    let countResult={} as CountResult;

    countResult.ccEncours = await this.prismaService.dossier.count({
      where: {
        AND: [
          { 
            type: TypeDossier.CCharges,
            archive: false
           },
        ],
      }
      });
      countResult.depEncours = await this.prismaService.dossier.count({
      where: {
        AND: [
          { 
            type: TypeDossier.Depouillement,
            archive: false
           },
        ],
      }
      });
            const today = new Date();
      let cc=0;
      const ccList = await this.prismaService.dossier.findMany({
        where: {
          type: TypeDossier.CCharges,
          archive: false,
        },
        select: {
          Chronologies: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });
      ccList.forEach(dossier => {
        const lastChronologie = dossier.Chronologies[0];        
        if (lastChronologie && lastChronologie.dateLimite < today) {
          cc++;
        }
      });

      Logger.debug("cc", cc);
      countResult.ccHorsDL=cc;
      
      

      let dep=0;
      const depList = await this.prismaService.dossier.findMany({
        where: {
          type: TypeDossier.Depouillement,
          archive: false,
        },
        include: {
          Chronologies: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      });
      depList.forEach(dossier => {
        const lastChronologie = dossier.Chronologies[0];        
        if (lastChronologie && lastChronologie.dateLimite < today) {
          dep++;
        }
      });

      Logger.debug("dep", dep);
      countResult.depHorsDL=dep;

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
      countResult.ccInstance = await this.prismaService.dossier.count({
        where: {
          AND: [
            { type: TypeDossier.CCharges, archive: false },
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
        }
      });

      countResult.depInstance = await this.prismaService.dossier.count({
        where: {
          AND: [
            { type: TypeDossier.Depouillement, archive: false },
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
        }
      });
    

        
      Logger.debug("result: ", countResult);
      return countResult;
      
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

  async getAdminDossiersByType(matCreateur: string, typeDossier: string,archived: boolean) {
    const typeDossierEnum = TypeDossier[typeDossier as keyof typeof TypeDossier];
    let dossiers:Dossier[];
    if (!typeDossierEnum) {
      throw new BadRequestException('Invalid typeDossier');
    }
  
      dossiers = await this.prismaService.dossier.findMany({
        where: {
          AND: [
            { type: typeDossierEnum,
              archive: archived
            },
            {
              OR: [
                {matCreateur: matCreateur},
                {matPresident: matCreateur},
              ]
            }
          ],
        },
        include: {
          Chronologies: {
            orderBy: {
              dateEnvoi: 'asc',
            }
          }, instance:true
        },
        orderBy: {
          importance: 'desc'
        },
        });
    
    
    return dossiers;
  }
  
  async getAllDossiersByType(typeDossier: string,archived: boolean) {
    const typeDossierEnum = TypeDossier[typeDossier as keyof typeof TypeDossier];
    let dossiers:DossierWithChronologies[];
    if (!typeDossierEnum) {
      throw new BadRequestException('Invalid typeDossier');
    }
  
    Logger.debug("getAllDossiersByType", typeDossier);
      dossiers= await this.prismaService.dossier.findMany({
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
              dateEnvoi: 'desc',
            },
            take:1,
          }, instance:true
        },
        orderBy: {
          importance: 'desc'
        },
        });


        return dossiers;
  }
  async getDossiersByCadreAndType(matPresident: string, typeDossier: string,archived: boolean) {
    const typeDossierEnum = TypeDossier[typeDossier as keyof typeof TypeDossier];
    let dossiers:Dossier[];
    if (!typeDossierEnum) {
      throw new BadRequestException('Invalid typeDossier');
    }

       dossiers = await this.prismaService.dossier.findMany({
        where: {
          AND: [
            { type: typeDossierEnum ,archive:archived},
            {
              OR: [
                {matPresident: matPresident},
                {matCreateur: matPresident}
              ]
              
            },
          ],
        },
        include: {
          Chronologies: {
            orderBy: {
              dateEnvoi: 'asc',
            }
          }, instance:true
        },
        orderBy: {
          importance: 'desc'
        },
        });
    
    
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
            dateLimite: 'desc',
          },
          where: {
            traite: false,
          },
        },
      },
      orderBy: {
        importance: 'desc',
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
            delai: 10,
            delaiImportant:9,
            delaiTresImportant:8,
            delaiVital:7,
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
    //check if userExistin General DB 
    const userRole = await this.getUserRole(createDossierDto.matPresident);
    console.log("UserRole: ", userRole);
    if(!userRole){
      await this.addUserRole(createDossierDto.matPresident);
      Logger.debug("User added to the application");
    }
    
    return this.findOne(dossier.id);  
  }
  async addUserRole(matricule: string){
    return this.prismaGeneralService.profil.create({
      data: {
        matricule: matricule,
        id_application: 13,
        profil: 'User'    
      }
    })
  }

  async getUserRole(matricule: string): Promise<UserRole> {
    let userRole: UserRole = undefined;
    //Get role
    try {
      const generalProfil = await this.prismaGeneralService.profil.findFirstOrThrow({
        where:
        {
          AND: [
            {
              matricule: matricule
            },
            {
              id_application: 13
            }
          ]
        }
      })
      userRole = this.checkProfil(generalProfil);
      console.log("Role: ", userRole);
      return userRole;

    } catch (error) {
      return userRole;

    }
  }
  checkProfil(generalProfil: { matricule: string; profil: string; id_application: number; last_access: Date | null; }): UserRole {
    let userRole: UserRole = UserRole.User;
    console.log("-------------- ", generalProfil.profil);

    switch (generalProfil.profil) {
      case 'SysAdmin':
        Logger.debug(generalProfil, 'SysAdmin');
        userRole = UserRole.SysAdmin
        break;
      case 'Admin':
        Logger.debug(generalProfil, 'Admin');
        userRole = UserRole.Admin
        break;
      case 'DG':
        Logger.debug(generalProfil, 'DG');
        userRole = UserRole.DG
        break;
      case 'User':
        Logger.debug(generalProfil, 'User');
        userRole = UserRole.User;
        break;

      default:
        userRole = UserRole.User;
        break;
    }
    return userRole;

  }
  
  async patch(id: number, updateDossierDto: Prisma.DossierUpdateInput) {
    
    // delete updateDossierDto.id;
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
    const today=new Date(Date.now())
    let _dateLimite=new Date(Date.now());
    console.log(chronologie);
    const lastChronologie = await this.updateLastChronologie(dossierId);
    const dossier=await this.prismaService.dossier.findUnique({
      where: {
        id: dossierId,
      },include: {
        instance: true,
      } 
    })
    const instance=await this.prismaService.instance.findUnique({
      where: {
        id: chronologie.idInstance,
      }
    })
    _dateLimite.setDate(today.getDate()+instance.delai);
    console.log(today);
    console.log(_dateLimite);
    
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
            dateEnvoi: today,
            traite: false, 
            commentaire: chronologie.commentaire,
            dateLimite: _dateLimite,
            fromInstance:lastChronologie.instance.libelle
          },
        },
      },
      include: {
        Chronologies: true,
      }
    })

    return this.findOne(dossierId);
      
    }

  remove(id: number) {
    return `This action removes a #${id} dossier`;
  }
}
