import { Controller,Get , Request} from '@nestjs/common';

@Controller('authProject')
export class AuthController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}