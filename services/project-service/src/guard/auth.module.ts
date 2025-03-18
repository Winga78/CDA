import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProjectsModule } from '../projects/projects.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ProjectsService } from '../projects/projects.service';


@Module({
  imports: [
    ProjectsModule, 
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
