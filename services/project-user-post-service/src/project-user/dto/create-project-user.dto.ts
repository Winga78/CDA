import { IsString, IsInt} from 'class-validator';
export class CreateProjectUserDto {
    @IsInt()
    readonly id?: number;

    @IsInt()
    readonly project_id: number;

    @IsString()
    readonly participant_email: string;   
} 
