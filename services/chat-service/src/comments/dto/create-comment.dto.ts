import { IsString, IsArray, IsInt, IsDateString } from 'class-validator';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Post } from 'src/posts/entities/post.entity';

export class CreateCommentDto {
  @IsInt()
  readonly id?: number;

  @IsString()
  readonly commentator: string;

  @IsInt()
  readonly po_id: DeepPartial<Post>;

  @IsArray()
  @IsString({ each: true })
  readonly participants: string[]; 

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsDateString()
  readonly createdAt: Date;

  @IsDateString()
  readonly modifiedAt: Date;
}
