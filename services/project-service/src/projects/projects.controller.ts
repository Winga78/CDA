import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards , Headers } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  
  @Post()
  create(@Headers('authorization') authHeader: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(authHeader,createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }


  @Get('user')
  findAllByUserId(@Headers('authorization') authHeader: string) {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Patch()
  updateDrop(string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateDrop(updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
