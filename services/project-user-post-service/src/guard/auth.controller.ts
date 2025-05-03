import { Controller,Get, Request} from '@nestjs/common';


@Controller('relation')
export class AuthController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}