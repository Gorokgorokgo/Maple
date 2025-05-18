import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,      // ← 주입 추가
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    // payload.sub 은 보통 DB의 _id(userId)
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    
    return {
      userId: payload.sub,
      userCode: user.userCode,
      role: payload.role,
    };
  }
}
