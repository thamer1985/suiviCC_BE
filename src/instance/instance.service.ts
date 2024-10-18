import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstanceService {
  constructor(
    private prismaService: PrismaService
  ) {}

  create(createInstanceDto: Prisma.InstanceCreateInput) {
    return 'This action adds a new instance';
  }

  findAll() {
    return this.prismaService.instance.findMany();

  }

  findOne(id: number) {
    return `This action returns a #${id} instance`;
  }

  update(id: number, updateInstanceDto: Prisma.InstanceUpdateInput) {
    return `This action updates a #${id} instance`;
  }

  remove(id: number) {
    return `This action removes a #${id} instance`;
  }
}
