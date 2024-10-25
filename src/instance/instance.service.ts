import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    return this.prismaService.instance.findMany();

  }

  findOne(id: number) {
    
    return this.prismaService.instance.findUnique({
      where: {
        id: id
      }
    })
  }

  patch(id: number, updateInstanceDto: Prisma.InstanceUpdateInput) {

    return this.prismaService.instance.update({
      where: {
        id: id
      },
      data: updateInstanceDto 
    })
  }

  remove(id: number) {
    return `This action removes a #${id} instance`;
  }
}
