import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) { 
    participants_has_voted?: [{ user_id: string; firtname: string; lastname: string; email: string; password: string; birthday: Date; avatar: string; role: string; createdAt: Date; }] | undefined;;
}
