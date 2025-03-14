import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEmail, IsDateString, IsOptional, IsEnum, IsInt, IsDate } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

      @IsString()
      readonly firstname: string;
  
      @IsString()
      readonly lastname: string;
      
      @IsEmail()
      readonly email: string;
    
      @IsString()
      readonly password: string;

      @IsOptional()
      @IsString()
      readonly avatar?: string;
}
