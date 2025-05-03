import {Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProjectUserService } from 'src/project-user/project-user.service';


@Module({
  controllers: [AuthController],
})
export class AuthModule {}
