import { IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'OPERATOR', description: '변경할 역할' })
  @IsString()
  @IsIn(['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'], {
    message:
      '유효하지 않은 역할입니다. 허용된 값: USER, OPERATOR, AUDITOR, ADMIN',
  })
  role: string;
}
