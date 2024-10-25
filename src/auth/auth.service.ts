import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaGeneralService } from 'src/prisma_general/prisma_general.service';
const bcrypt = require('bcryptjs');
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from './constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { stringify } from 'querystring';
import { Instance } from '@prisma/client';
import { CadreService } from 'src/cadre/cadre.service';
const oneDay = 3600 * 1000 * 24;
@Injectable()
export class AuthService {
  constructor(
    private prismaGeneralService: PrismaGeneralService,
    private prismaService: PrismaService,
    private cadreService:CadreService,
    private jwt: JwtService,
  ) {}

  async login(matricule: string, password: string, res: any) {
    const user = await this.prismaGeneralService.agent.findUnique({
      where: { matricule },
    });
    if (!user) {
      throw new BadRequestException('incorrect matricule');
    }
    const isMatch = await this.comparePassword({
      password,
      hash: user.mot_pass,
    });
    if (!isMatch) {
      throw new BadRequestException('Incorrect Password');
    }

    const instances = await this.cadreService.getInstances(matricule);
    console.log(instances);
    
    const token = await this.signToken({
      matricule: user.matricule,
      name: user.nom_prenom,
      instances: instances,
    });
    if (!token) {
      throw new ForbiddenException('Token not received');
    }
    res.cookie('token', token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // secure: false,
      expires: new Date(Date.now() + oneDay),
      // expires: new Date(Date.now() + 30*1000)
  });
 
    res.send({
      message: 'Logged In',
      matricule: user.matricule,
      name: user.nom_prenom,
      instances: instances,
      //data: token
    });
  }
  async comparePassword(args: { password: string; hash: string }) {
    // h1=bcrypt.hash(args.password)
    return await bcrypt.compareSync(args.password, args.hash);
  }
  async signToken(args: {
    matricule: string;
    name: string;
    instances: Instance[];
  }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
  signout(req: any, res: any) {
    res.clearCookie('token');
    return res.send({ message: 'Cookie cleared' });
  }
}
