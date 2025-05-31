import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user-dto';
import { User } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(credentials: LoginUserDto): Promise<User> {
    return await this.usersService.validateUser(credentials);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDto): Promise<{
    access_token: string;
  }> {
    const existingUser = await this.usersService.findOne(user.email);
    if (existingUser) throw new BadRequestException('Email already exists');
    const newUser = await this.usersService.create(user);
    return this.login(newUser);
  }
}
