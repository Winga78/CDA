import { Body, Controller, Post,Get,HttpCode, HttpStatus , Request,UseGuards} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}