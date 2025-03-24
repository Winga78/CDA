import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreateProjectDto {

    @IsInt()
    readonly id?: number; 

    @IsString()
    readonly user_id: string;  
  
    @IsString()
    readonly name: string;  
  
    @IsString()
    readonly description: string;
  
    @IsDateString()
    readonly createdAt: Date;
  
    @IsDateString()
    readonly modifiedAt: Date;
}
