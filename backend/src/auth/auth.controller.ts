import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from 'src/constants';
import { LoginUserDto } from 'src/users/dto/login-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginUserDto, @Res({ passthrough: true }) res) {
    const user = await this.authService.validateUser(body);
    if (!user) return { error: 'Invalid credentials' };

    const token = await this.authService.login(user);
    res.cookie('accessToken', token.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return token;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }

  @Get('me')
  getMe(@Req() req) {
    return { user: req.user };
  }
}
