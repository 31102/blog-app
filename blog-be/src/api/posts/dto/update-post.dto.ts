import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

// export class UpdatePostDto extends PartialType(CreatePostDto) {}

import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}