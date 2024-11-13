import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtSecret } from './constants';
import { Request } from 'express';
import { PrismaGeneralService } from 'src/prisma_general/prisma_general.service';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaGeneralService:PrismaGeneralService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: jwtSecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies) {
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload: { matricule: string; name: string }) {
    
    const user=await this.prismaGeneralService.agent.findUnique({
      where:
      {matricule:payload.matricule}
  });
   return user;
  }
}