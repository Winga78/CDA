import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateCollectionDto {

  @IsInt()
  readonly id?: number;

  @IsString()
  readonly user_id: string;

  @IsString()
  readonly name: string;

  @IsDateString()
  readonly createdAt: Date;

  @IsDateString()
  readonly modifiedAt: Date;
}
