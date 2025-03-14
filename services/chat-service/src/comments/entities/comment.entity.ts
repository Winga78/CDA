
import { Entity, Column, ManyToOne ,PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, JoinColumn  } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commentator: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  po_id: Post;

  @JoinTable({ name: "com_has_voted" })
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
