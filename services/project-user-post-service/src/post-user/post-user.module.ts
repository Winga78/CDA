import { Module } from '@nestjs/common';
import { PostUserService } from './post-user.service';
import { PostUserController } from './post-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostUser } from './entities/post-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostUser])],
  controllers: [PostUserController],
  providers: [PostUserService],
  exports: [TypeOrmModule],
})
export class PostUserModule {}
