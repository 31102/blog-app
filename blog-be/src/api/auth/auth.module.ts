import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller'; 
import { AuthService } from './auth.service'; 
import { JwtStrategy } from './jwt.strategy'; 
import { UsersModule } from '../users/users.module'; 
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret', 
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1h' }, 
    }),
    UsersModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
