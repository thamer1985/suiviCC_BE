import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CadreService {
  constructor(
    private prismaService: PrismaService,
  ) {}
  create(createCadreDto: Prisma.CadreCreateInput) {

  }

  findAll() {
   
    return this.prismaService.cadre.findMany({
    })
  }

  findOne(id: number) {
    console.log(`Getting Cadre with id ${id}`);
    
    return this.prismaService.cadre.findUnique({
      where: { id }
    });
  }

  update(id: number, updateCadreDto: Prisma.CadreUpdateInput) {
    return `This action updates a #${id} cadre`;
  }

  remove(id: number) {
    return `This action removes a #${id} cadre`;
  }

  async getInstances(matricule: string) {

    return await this.prismaService.instance.findMany({
      where: {
        membres: {
          some: {
            cadre: {
              MAT_PERS: matricule
            }
          }
        }
      }
    });
  }
}
