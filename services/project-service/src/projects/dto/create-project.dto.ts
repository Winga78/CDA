import { IsString, IsInt, IsOptional, IsArray, IsDateString } from 'class-validator';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Collection } from '../../collections/entities/collection.entity';

export class CreateProjectDto {

    @IsInt()
    readonly id?: number; 

    @IsString()
    readonly user_id: string;  
  
    @IsInt()
    readonly collection?: DeepPartial<Collection>; 
  
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
