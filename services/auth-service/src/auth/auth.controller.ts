import { Body, Controller, Post,Get,HttpCode, HttpStatus , Request,Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(signInDto.email, signInDto.password, res);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}