import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaGeneralService } from 'src/prisma_general/prisma_general.service';

@Injectable()
export class AgentService {
  
    constructor(
        private prismaGeneralService: PrismaGeneralService
      ) {}
      findAll() {
        return this.prismaGeneralService.agent.findMany({
            select:{
                matricule:true,
                nom_prenom:true,
                nom_prenom_fr:true
            }
        })
    }

      findOne(matriule: string) {    
    return this.prismaGeneralService.agent.findFirst({
        select:{
            matricule:true,
            nom_prenom:true   
        },
        where:{
            matricule:matriule
        }
    })
  }
}
