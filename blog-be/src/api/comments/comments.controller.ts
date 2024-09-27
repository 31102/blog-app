import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, Request, NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req
  ) {
    const user = req.user; 
    return await this.commentsService.create(createCommentDto, user, postId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({ status: 200, description: 'List of comments.' })
  async findAll(@Param('postId') postId: string) {
    return await this.commentsService.findAllByPost(postId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single comment by ID' })
  @ApiResponse({ status: 200, description: 'The comment found.', type: UpdateCommentDto })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: string) {
    return await this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/replies')
  @ApiOperation({ summary: 'Reply to a comment' })
  @ApiResponse({ status: 201, description: 'Reply created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async reply(
    @Param('id') commentId: string,
    @Body() createReplyDto: CreateReplyDto,
    @Request() req
  ) {
    const user = req.user; 
    return await this.commentsService.replyToComment(createReplyDto, user, commentId);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get all replies for a comment' })
  @ApiResponse({ status: 200, description: 'List of replies.', type: [UpdateCommentDto] })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findReplies(@Param('id') commentId: string) {
    const replies = await this.commentsService.findRepliesByComment(commentId);
    if (!replies) {
      throw new NotFoundException('Comment not found');
    }
    return replies;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req
  ) {
    const user = req.user; 
    return await this.commentsService.update(id, updateCommentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async remove(@Param('id') id: string, @Request() req) {
    const user = req.user; 
    return await this.commentsService.remove(id, user);
  }
}
