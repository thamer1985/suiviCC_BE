import { Injectable } from '@nestjs/common';
import { CreateProfilDto } from './dto/create-profil.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Instance } from '@prisma/client';

@Injectable()
export class ProfilService {
  constructor(private prismaService: PrismaService) {}
  create(createProfilDto: CreateProfilDto) {
    return 'This action adds a new profil';
  }

  findAll() {
    return `This action returns all profil`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profil`;
  }

  update(id: number, updateProfilDto: UpdateProfilDto) {
    return `This action updates a #${id} profil`;
  }

  remove(id: number) {
    return `This action removes a #${id} profil`;
  }
  async getInstances(matricule: string) {
    let listInstances: Instance[] = [];
    
    const profils = await this.prismaService.profil.findMany({
      where: { matricule: matricule },
      include: {
        membres: true,
      },
    });
  
    // Use Promise.all to wait for all asynchronous operations to complete
    await Promise.all(profils.map(async (profil) => {
      await Promise.all(profil.membres.map(async (membre) => {
        const instance = await this.prismaService.instance.findUnique({
          where: {
            id: membre.idInstance,
          },
        });
        if (instance) {
          listInstances.push(instance);
        }
      }));
    }));
  
    console.log(listInstances);
    
    return listInstances;
  }
}
