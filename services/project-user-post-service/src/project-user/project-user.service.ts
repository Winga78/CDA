import { Injectable , NotFoundException } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private projectsUsersRepository: Repository<ProjectUser>,
  ) {}

  async create(createProjectUserDto: CreateProjectUserDto) {
    return this.projectsUsersRepository.save(createProjectUserDto);
  }

  async findAllUserByIdProject(id: number) {
    const project = await this.projectsUsersRepository.findOneBy({project_id: id });
    if (!project) {
      throw new NotFoundException('Aucun project trouvé pour cette id');
    }
    return project;
  }

  async findProjectsByUserEmail(email: string) {
    const project = await this.projectsUsersRepository.findOneBy({participant_email: email });
    if (!project) {
      throw new NotFoundException('Aucun project trouvé pour cette email');
    }
    return project;
  }

  async removeUserParticipation(id: number) {
    const project = await this.projectsUsersRepository.findOneBy({ project_id :id });

    if (!project) {
      throw new NotFoundException('Impossible de supprimer, projet non trouvé');
    }

    await this.projectsUsersRepository.delete(id);

    return { message: 'Projet supprimé avec succès' };
  }
}
