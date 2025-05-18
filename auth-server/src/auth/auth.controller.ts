import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  
  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '새로운 유저를 등록합니다.' })
  @ApiResponse({ status: 201, description: '회원가입 성공', type: User })
  @ApiResponse({ status: 409, description: 'ID 또는 닉네임 중복' })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인', description: 'ID : 영문 + 숫자, 4자 이상 20자까지  / PASSWORD : 소문자, 대문자, 숫자, 특수문자를 모두 포함하여 8자 이상 15자리' })
  @ApiResponse({ status: 200, description: '로그인 성공, JWT 반환' })
  @ApiResponse({ status: 401, description: 'ID 또는 PW 불일치' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}