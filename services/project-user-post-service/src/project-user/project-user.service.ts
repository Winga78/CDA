import { Injectable , NotFoundException, ConflictException } from '@nestjs/common';
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

  async create(createProjectUserDto: CreateProjectUserDto): Promise<ProjectUser> {
    const existingProjectUser = await this.projectsUsersRepository.findOneBy({project_id : createProjectUserDto.project_id , participant_id : createProjectUserDto.participant_id })
    if(existingProjectUser){
      throw new ConflictException('Utilisateur déjà ajouté');
    }
    return this.projectsUsersRepository.save(createProjectUserDto);
  }

  async findAllUserByIdProject(id: number) : Promise<ProjectUser[]>{
    const project = await this.projectsUsersRepository.findBy({project_id: id });
    
    if (project.length == 0) {
      throw new NotFoundException('Aucun project trouvé pour cet id');
    }
    return project;
  }

  async findProjectsByUserEmail(id: string): Promise<ProjectUser[]>{
    const project = await this.projectsUsersRepository.findBy({participant_id: id });
    if (!project) {
      throw new NotFoundException('Aucun project trouvé pour cette email');
    }
    return project;
  }

  
  async findRecentProjects(id: string): Promise<ProjectUser[]> {
    const projects = await this.projectsUsersRepository.createQueryBuilder('project_user')
      .where('participant_id = :id', { id })
      .limit(3)
      .getMany();
    return projects;
  }


  async removeUserParticipation(id: number, user_id: string) {
    const project = await this.projectsUsersRepository.findOneBy({
      project_id: id,
      participant_id: user_id
    });
  
    if (!project) {
      throw new NotFoundException('Impossible de supprimer, participant non trouvé');
    }
    await this.projectsUsersRepository.delete(project);
  
    return { message: 'Utilisateur supprimé du projet avec succès' };
  }
}
