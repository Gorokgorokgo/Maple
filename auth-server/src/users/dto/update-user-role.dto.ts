import { IsEnum, IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'OPERATOR', description: '변경할 역할' })
  @IsEnum(Role, {
    message:
      '유효하지 않은 역할입니다. 허용된 값: USER, OPERATOR, AUDITOR, ADMIN',
  })
  role: Role;
}
