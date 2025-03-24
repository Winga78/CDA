import { Entity, Column ,PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PostUser {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: false })
    participant_id: string;

    @Column()
    post_id : number;
}
