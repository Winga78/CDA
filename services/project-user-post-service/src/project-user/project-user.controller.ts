import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { Roles } from './roles.decorator';
import { UserRole } from './entities/UserRoleEnum';
import { RolesGuard } from '../guard/roles.guard';

@Controller('project-user')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createProjectUserDto: CreateProjectUserDto){
    return this.projectUserService.create(createProjectUserDto);
  }

  @Get('users/:id')
  async findAllUserByIdProject(@Param('id') id: string) {
    return await this.projectUserService.findAllUserByIdProject(+id);
  }

  @Get('projects')
  findProjectsByUserEmail(@Request() req) {
    return this.projectUserService.findProjectsByUserId(req.user.id);
  }

  @Get('/last')
  findLastProject(@Request() req) {
    return this.projectUserService.findRecentProjects(req.user.id);
  }

  @Delete(':projectId/:userId')
  remove(@Param('projectId') id: string, @Param('userId') user_id: string) {
    return this.projectUserService.removeUserParticipation(+id, user_id);
  }
}
