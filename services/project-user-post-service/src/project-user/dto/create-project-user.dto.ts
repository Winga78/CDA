import { IsString, IsInt , IsEnum, IsOptional } from 'class-validator';
import { UserRole } from "../entities/UserRoleEnum";
export class CreateProjectUserDto {
    @IsInt()
    readonly id?: number;

    @IsInt()
    readonly project_id: number;

    @IsString()
    readonly participant_email: string;   

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
} 
