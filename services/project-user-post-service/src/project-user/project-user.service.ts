import { Injectable , NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import axios from 'axios';

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
    return project;
  }

  async findProjectsByUserId(id: string): Promise<ProjectUser[]>{
    const project = await this.projectsUsersRepository.findBy({participant_id: id });
    return project;
  }

  
  async findRecentProjects(id: string): Promise<ProjectUser[]> {
    const projects = await this.projectsUsersRepository.createQueryBuilder('project_user')
      .where('participant_id = :id', { id })
      .limit(3)
      .getMany();
    return projects;
  }
 
  async findUserByProject(project_id: number, user_id: string) {
    const projectUser = await this.projectsUsersRepository.createQueryBuilder('project_user')
      .where('project_user.participant_id = :user_id AND project_user.project_id = :project_id', { user_id, project_id })
      .getOne();
    return projectUser;
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

  
  async findProject(project_id: number, token: string) {
    const uri = process.env.VITE_PROJECT_SERVICE_URL || "http://localhost:3002";
  
    const project = await axios.get(`${uri}/projects/${project_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return project;
  }

}
