import { IsString, IsEmail, IsDateString, IsOptional, IsEnum, IsInt, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly id?: string;

  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsDateString()
  readonly birthday: Date;

  @IsOptional()
  @IsString()
  readonly avatar?: string;
  
  @IsDateString()
  readonly createdAt: Date;
}
