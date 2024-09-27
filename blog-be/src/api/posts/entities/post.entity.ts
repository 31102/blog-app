import { Comment } from 'src/api/comments/entities/comment.entity';
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
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.posts, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  
  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  comments: Comment[];
}
