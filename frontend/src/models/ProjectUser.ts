import { UserRole } from "./UserRoleEnum";

export interface ProjectUser {
    id?: number;
   
    project_id: number;

    participant_email: string;   

    role?: UserRole;
}