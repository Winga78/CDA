
import { Entity, Column, ManyToOne ,PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  user_id: string;

  project_id: number;

  @Column({ type: 'json', nullable: true })
  participants_has_voted: { id: string }[];

  @Column()
  titre: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  modifiedAt: Date;
}

