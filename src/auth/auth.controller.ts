import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
   
  @Post('login')
  async login (@Body() postData: { matricule: string; password: string },
  @Res() res,){
    const { matricule, password } = postData;
    return await this.authService.login(matricule, password, res);
  }
  @Get('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }
}
