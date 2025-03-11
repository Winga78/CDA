import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CollectionsModule } from 'src/collections/collections.module';
import { HttpModule } from '@nestjs/axios';
import { ProfileService } from 'src/profile/profile.service';
@Module({
  imports: [TypeOrmModule.forFeature([Project]), CollectionsModule, HttpModule, ProfileService],
  controllers: [ProjectsController],
  providers: [ProjectsService],
 
})
export class ProjectsModule {}
