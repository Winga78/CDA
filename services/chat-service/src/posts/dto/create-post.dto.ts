import { IsString, IsInt, IsArray, IsDateString } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  readonly id?: number;

  @IsString()
  readonly user_id: string;

  @IsInt()
  readonly project_id: number;

  @IsArray()
  @IsString({ each: true })
  readonly  participants_has_voted?: { id: string }[];

  @IsString()
  readonly titre: string;

  @IsString()
  readonly description: string;

  @IsDateString()
  readonly createdAt: Date;

  @IsDateString()
  readonly modifiedAt: Date;
}
