import { IsString, IsInt, IsDateString } from 'class-validator';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
export class CreateMediaDto {
 
  @IsInt()
  readonly comment_id: DeepPartial<Comment>;

  @IsInt()
  readonly po_id: DeepPartial<Post>;

  @IsString()
  readonly name: string;

  @IsString()
  readonly type: string;

  @IsString()
  readonly path: string;

  @IsString()
  readonly size: string;

  @IsDateString()
  readonly createdAt: Date;

  @IsDateString()
  readonly modifiedAt: Date;
}
