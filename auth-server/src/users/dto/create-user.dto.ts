import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'loginId는 영문자와 숫자만 사용할 수 있습니다.',
  })
  loginId: string;

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:"<>,./?]).{8,15}$/, {
    message: '비밀번호는 소문자, 대문자, 숫자, 특수문자를 모두 포함해야 합니다.',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  nickname: string;

}