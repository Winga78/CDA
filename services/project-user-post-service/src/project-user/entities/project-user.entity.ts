import { Entity, Column ,PrimaryGeneratedColumn} from 'typeorm';
import { UserRole } from "./UserRoleEnum";

@Entity()
export class ProjectUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    project_id: number;

    @Column()
    participant_id: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
      })
      role: UserRole;
}
