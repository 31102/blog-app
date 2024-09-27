import { Post } from 'src/api/posts/entities/post.entity';
import { User } from 'src/api/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;
  
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user: User;
  
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  parentComment: Comment;
  
  @OneToMany(() => Comment, (comment) => comment.parentComment, { cascade: true })
  @JoinColumn()
  replies: Comment[];
  
}
