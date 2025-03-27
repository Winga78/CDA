import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';

@Controller('project-user')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Post()
  create(@Body() createProjectUserDto: CreateProjectUserDto){
    return this.projectUserService.create(createProjectUserDto);
  }

  @Get('users/:id')
  async findAllUserByIdProject(@Param('id') id: string) {
    return await this.projectUserService.findAllUserByIdProject(+id);
  }

  @Get('projects')
  findProjectsByUserEmail(@Request() req) {
    return this.projectUserService.findProjectsByUserEmail(req.user.email);
  }

  @Get('/last')
  findLastProject(@Request() req) {
    return this.projectUserService.findRecentProjects(req.user.email);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() body: { email: string }) {
    return this.projectUserService.removeUserParticipation(+id, body.email);
  }
}
