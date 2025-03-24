import { Entity, Column ,PrimaryGeneratedColumn} from 'typeorm';
@Entity()
export class ProjectUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    project_id: number;

    @Column()
    participant_email: string;
}
