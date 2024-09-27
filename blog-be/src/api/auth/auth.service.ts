
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto) {
    return this.usersService.validateUser(loginUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const { password, ...userWithoutPassword } = user;
    const payload = { sub: user.id, email: user.email }; 
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword, 
    };
  }
  
}