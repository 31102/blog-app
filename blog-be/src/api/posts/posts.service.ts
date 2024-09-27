import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const post = this.postRepository.create({
      ...createPostDto,
      user,
      timestamp: new Date(),
    });

    return await this.postRepository.save(post);
  }

  async findAll(page: number = 2, limit: number = 5) {
    const [posts, totalCount] = await this.postRepository.findAndCount({
      relations: ['user', 'comments', 'comments.user'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const fetchReplies = async (comments) => {
      for (const comment of comments) {
        comment.replies = await this.commentRepository.find({
          where: { parentComment: comment },
          relations: ['replies', 'user'], // Include user for each reply
        });
        await fetchReplies(comment.replies);
      }
    };

    await Promise.all(posts.map((post) => fetchReplies(post.comments)));

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return {
      posts,
      totalPages,
      currentPage: page,
    };
  }

  async findAllByUser(userId: string, page: number = 1, limit: number = 5) {
    const [posts, totalCount] = await this.postRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user', 'comments', 'comments.user'],
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const fetchReplies = async (comments) => {
      for (const comment of comments) {
        comment.replies = await this.commentRepository.find({
          where: { parentComment: comment },
          relations: ['replies', 'user'], // Include user for each reply
        });
        await fetchReplies(comment.replies);
      }
    };
  
    await Promise.all(posts.map((post) => fetchReplies(post.comments)));
  
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
  
    return {
      posts,
      totalPages,
      currentPage: page,
    };
  }
  
  
  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.user.id !== user.id) {
      throw new ForbiddenException(
        `You do not have permission to update this post`,
      );
    }

    Object.assign(post, updatePostDto);

    return await this.postRepository.save(post);
  }

  async remove(id: string, user: User) {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments', 'user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.user.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }

    await this.postRepository.remove(post);
    return { deleted: true };
  }
}
