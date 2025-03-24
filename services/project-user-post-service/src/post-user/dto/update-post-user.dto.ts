import { PartialType } from '@nestjs/mapped-types';
import { CreatePostUserDto } from './create-post-user.dto';

export class UpdatePostUserDto extends PartialType(CreatePostUserDto) {}
