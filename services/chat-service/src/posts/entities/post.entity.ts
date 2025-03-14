
import { Entity, Column, ManyToOne ,PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  user_id: string;

  project_id: number;

  @Column()
  participants_has_voted: [{
    user_id : string,
    firtname : string,
    lastname : string,
    email : string,
    password : string,
    birthday : Date;
    avatar : string,
    role : string;
    createdAt : Date
  }];

  @Column()
  titre: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  modifiedAt: Date;
}

