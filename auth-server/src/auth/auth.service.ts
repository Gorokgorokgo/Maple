import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/users/dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { loginId, password } = loginDto;

    const user = await this.usersService.findByLoginId(loginId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 로그인 ID입니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
