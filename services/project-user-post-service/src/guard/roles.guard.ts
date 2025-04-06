import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../project-user/entities/UserRoleEnum';
import { ProjectUserService } from '../project-user/project-user.service';
import { ROLES_KEY } from '../project-user/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly projectUserService: ProjectUserService,
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
    const userConnected = request.user;
    const project = request.body;

    // Récupération propre du token dans les headers
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Token manquant');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Format de token invalide');
    }

    if (!userConnected || !project.project_id) {
      throw new UnauthorizedException('Utilisateur ou projet non valide');
    }

    // Récupération de l’ID du créateur du projet
    const response = await this.projectUserService.findProject(project.project_id, token);
    const userCreatorId = response.data.user_id;

    // Si l'utilisateur connecté est le créateur, il a tous les droits
    if (userConnected.id === userCreatorId) {
      return true;
    }

    // Sinon, on vérifie s’il a le rôle requis dans ce projet
    const userFromDb = await this.projectUserService.findUserByProject(
      project.project_id,
      userConnected.participant_id,
    );

    if (!userFromDb) {
      throw new UnauthorizedException('Utilisateur non trouvé dans ce projet');
    }

    const hasRole = requiredRoles.includes(userFromDb.role);
    if (!hasRole) {
      throw new UnauthorizedException(
        `Accès interdit : vous n'avez pas les droits requis pour cette action.`,
      );
    }

    return true;
  }
}