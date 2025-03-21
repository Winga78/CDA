import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PostsModule } from '../posts/posts.module';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [
    PostsModule, 
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
