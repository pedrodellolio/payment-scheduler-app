import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException(
        'JWT_SECRET is not defined in environment variables',
      );
    }
    super({
      jwtFromRequest: (req) => req.cookies?.accessToken,
      ignoreExpiration: true,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return {
      userId: payload.sub,
      email: payload.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
