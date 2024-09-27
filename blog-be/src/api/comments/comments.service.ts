import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User, postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      user,
      post,
      timestamp: new Date(),
    });

    return await this.commentRepository.save(comment);
  }

  async replyToComment(
    createReplyDto: CreateReplyDto,
    user: User,
    commentId: string,
  ) {
    const parentComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['replies'],
    });

    if (!parentComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    const reply = this.commentRepository.create({
      ...createReplyDto,
      user,
      parentComment,
      timestamp: new Date(),
    });

    return await this.commentRepository.save(reply);
  }

  async findRepliesByComment(commentId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { parentComment: { id: commentId } }, // Use parentComment instead of parentId
    });
  }

  async findAllByPost(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comments', 'comments.user'], // Include user relation in comments
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return post.comments;
  }

  async findOne(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'replies'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    if (comment.user.id !== user.id) {
      throw new ForbiddenException(
        `You do not have permission to update this comment`,
      );
    }

    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: string, user: User) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post.user'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    console.log(comment);
    // Check if the user is the owner of the post
    if (!comment.post) {
      if (comment.user.id !== user.id) {
        console.log('first')
      }
    } else if (comment.user.id == user.id) {
      await this.commentRepository.remove(comment);
      return { deleted: true };
    } else {
      if (comment.post.user.id !== user.id) {
        throw new ForbiddenException(
          `You do not have permission to delete this comment`,
        );
      }
    }

    await this.commentRepository.remove(comment);
    return { deleted: true };
  }
}
