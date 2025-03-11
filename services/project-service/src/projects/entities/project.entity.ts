
import { Entity, Column, ManyToOne ,PrimaryGeneratedColumn, JoinColumn,ManyToMany , JoinTable } from 'typeorm';
import { Collection } from '../../collections/entities/collection.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(() => Collection)
  collection: Collection;

  @JoinTable({ name: "Project_has_participated" })
  participants: string[];

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  modifiedAt: Date;
}
