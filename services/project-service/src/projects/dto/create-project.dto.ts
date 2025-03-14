import { IsString, IsInt, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateProjectDto {

    @IsInt()
    readonly id?: number; 

    @IsString()
    readonly user_id: string;  
  
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
