import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaGeneralModule } from 'src/prisma_general/prisma_general.module';
import { PrismaGeneralService } from 'src/prisma_general/prisma_general.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CadreService } from 'src/cadre/cadre.service';

@Module({
  imports: [JwtModule.register({}), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaGeneralService, PrismaService,CadreService],
})
export class AuthModule {}
