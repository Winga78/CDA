import { Injectable , NotFoundException , ConflictException} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,

  ) {}

  async create(user:any ,createProjectDto: CreateProjectDto): Promise<Project> {
    
    const existingProject = await this.projectsRepository.findOneBy({ name: createProjectDto.name });
    
    if (existingProject) {
      throw new ConflictException('Un projet avec ce nom existe déjà');
    }
    const createProject : CreateProjectDto = {
      user_id : user.id,
      name : createProjectDto.name,
      description : createProjectDto.description,
      createdAt : new Date(),
      modifiedAt : new Date()
    }
    return this.projectsRepository.save(createProject);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepository.find();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException('Aucun project trouvé pour cette id');
    }

    return project;
  }

  // mettre à jour la liste des participants au projet, le nom et la description
  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project | null> {
    const project = await this.projectsRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException('Impossible de mettre à jour, projet non trouvé');
    }

    const updateProject : UpdateProjectDto = {
      name : updateProjectDto.name,
      description : updateProjectDto.description,
      modifiedAt : new Date()
    }
    await this.projectsRepository.update(id, updateProject);

    return this.projectsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<{ message: string }> {
    const project = await this.projectsRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException('Impossible de supprimer, projet non trouvé');
    }

    await this.projectsRepository.delete(id);

    return { message: 'Projet supprimé avec succès' };
  }

  async findAllByUserId(user:any): Promise<Project[]>{
  
    return await this.projectsRepository.findBy({user_id : user.id});
  }

}