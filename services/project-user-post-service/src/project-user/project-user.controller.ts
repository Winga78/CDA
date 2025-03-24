import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';

@Controller('project-user')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Post()
  create(@Body() createProjectUserDto: CreateProjectUserDto) {
    return this.projectUserService.create(createProjectUserDto);
  }

  @Get(':id')
  findAllUserByIdProject(@Param('id') id: string) {
    return this.projectUserService.findAllUserByIdProject(+id);
  }

  @Get()
  findProjectsByUserEmail(@Request() req) {
    return this.projectUserService.findAllUserByIdProject(req.user.email);
  }

 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectUserService.removeUserParticipation(+id);
  }
}
