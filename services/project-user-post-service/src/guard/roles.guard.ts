
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../project-user/entities/UserRoleEnum'
import { ProjectUserService } from '../project-user/project-user.service';
import { ROLES_KEY } from 'src/project-user/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector, 
    private readonly projectUserService: ProjectUserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user_connected = request['user'];
    const project_id = request['body']?.project_id;
    if (!user_connected || !project_id) {
      throw new UnauthorizedException('Utilisateur ou projet non valide');
    }

    const userFromDb = await this.projectUserService.findUserByProject(project_id, user_connected.id); // Assure-toi que `user_connected.id` existe et est correct

    if (!userFromDb) {
      throw new UnauthorizedException('Utilisateur non trouvé dans ce projet');
    }

    const hasRole = requiredRoles.some(role => userFromDb.role === role);
    if (!hasRole) {
      throw new UnauthorizedException(`Accès interdit : vous n'avez pas les droits requis pour cette action.`);
    }

    return true;
  }
}
