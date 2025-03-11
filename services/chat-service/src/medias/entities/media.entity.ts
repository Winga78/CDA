
import { Entity, Column, ManyToOne ,PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';
@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment)
  comment_id: Comment;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  po_id: Post;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  path: string;

  @Column()
  size: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  modifiedAt: Date;
}
