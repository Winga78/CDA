import { Module } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser]), HttpModule],
  controllers: [ProjectUserController],
  providers: [ProjectUserService],
  exports: [TypeOrmModule , ProjectUserService],
})
export class ProjectUserModule {}
