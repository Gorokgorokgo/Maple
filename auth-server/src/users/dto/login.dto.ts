import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'mapler77', description: '로그인 ID' })
  @IsString()
  loginId: string;

  @ApiProperty({ example: 'qweQWE123!@#', description: '비밀번호' })
  @IsString()
  password: string;
}