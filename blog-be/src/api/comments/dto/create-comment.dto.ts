import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment' })
  content: string;

  @ApiProperty({ description: 'The timestamp of the comment' })
  timestamp: Date;

  @ApiProperty({ description: 'The ID of the post the comment belongs to' })
  postId: string;

  @ApiProperty({ description: 'The ID of the user who made the comment' })
  userId: string;

  @ApiProperty({ description: 'The ID of the parent comment if it is a reply', required: false })
  parentCommentId?: string;
}
