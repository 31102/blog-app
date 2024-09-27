import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'The user\'s email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user\'s password' })
  @IsString()
  password: string;
}
