import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The user\'s email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user\'s username' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'The user\'s full name' })
  @IsString()
  fullname: string;

  @ApiProperty({ description: 'The user\'s password (minimum length: 6)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
