import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'qwerty',
    });
  }

  async validate(payload: { sub: number, email: string }) {
    const data = { id: payload.sub, email: payload.email };
    const user = await this.userService.findByCond(data);

    if (!user) {
      throw new UnauthorizedException('Нет доступа к этой странице');
    }
    return {
      email: user.email,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
