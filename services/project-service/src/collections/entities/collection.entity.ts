
import { Entity, Column, ManyToOne ,PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
@Entity()
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: false })
  user_id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp'})
  createdAt: Date;

  @Column({ type: 'timestamp'})
  modifiedAt: Date;
}
