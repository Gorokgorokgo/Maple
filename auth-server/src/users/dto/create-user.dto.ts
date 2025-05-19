import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'mapler77', description: '로그인 ID (영문 + 숫자)' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'loginId는 영문자와 숫자만 사용할 수 있습니다.',
  })
  loginId: string;

  @ApiProperty({ example: 'qweQWE123!@#', description: '비밀번호 (대/소문자, 숫자, 특수문자 조합)' })
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:"<>,./?]).{8,15}$/, {
    message: '비밀번호는 소문자, 대문자, 숫자, 특수문자를 모두 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({ example: 'zi존법사', description: '닉네임 (2~30자)' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  nickname: string;

  @ApiProperty({ example: Role.USER, enum: Role, description: '유저 역할' })
  @IsEnum(Role)
  role: Role;
}