import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), HttpModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [TypeOrmModule , ProjectsService],
})
export class ProjectsModule {}
