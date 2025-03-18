import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    participants?: { email: string }[] | undefined;
    name?: string | undefined;
    description?: string | undefined;
}
