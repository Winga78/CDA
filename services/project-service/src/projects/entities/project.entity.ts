
import { Entity, Column ,PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: string;

  @Column()
  participants: [
    {
      email : string
    }
  ];

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  modifiedAt: Date;
}
