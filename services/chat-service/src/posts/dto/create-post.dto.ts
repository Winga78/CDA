import { IsString, IsInt, IsArray, IsDateString } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  readonly id?: number;

  @IsString()
  readonly user_id: string;

  @IsInt()
  readonly project_id: number;

  @IsString()
  readonly titre: string;

  @IsString()
  readonly description: string;
}
