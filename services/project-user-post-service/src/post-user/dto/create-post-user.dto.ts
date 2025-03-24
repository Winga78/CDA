import { IsString, IsInt, IsOptional, IsArray, IsDateString } from 'class-validator';
export class CreatePostUserDto {
    @IsInt()
    readonly id?: number; 

    @IsString()
    readonly participant_id: string;  

    @IsInt()
    readonly post_id: number

}
