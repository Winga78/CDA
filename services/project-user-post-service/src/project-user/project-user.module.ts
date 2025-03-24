import { Module } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project-user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser])],
  controllers: [ProjectUserController],
  providers: [ProjectUserService],
  exports: [TypeOrmModule],
})
export class ProjectUserModule {}
