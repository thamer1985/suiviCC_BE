import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
   
  @Post('login')
  async login (@Body() postData: { matricule: string; password: string },
  @Res() res,){
    const { matricule, password } = postData;
    return await this.authService.login(matricule, password, res);
  }
  @Get('logout')
  signout(@Req() req, @Res() res) {
    return this.authService.logout(req, res);
  }

  @Get('verify-token')
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.token;
    console.log(token);
    
    if (!token) {
      console.log("There is no token" );
      
      return res.status(401).json({ isAuthenticated: false });
    }

    try {
      const result = await this.authService.verifyToken(token);
      return res.status(200).json({ isAuthenticated: result.isAuthenticated });
    } catch (error) {
      return res.status(401).json({ isAuthenticated: false, message: error.message });
    }
  }
}
