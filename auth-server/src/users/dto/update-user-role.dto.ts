import { IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'OPERATOR', description: '변경할 역할' })
  @IsString()
  @IsIn(['USER', 'OPERATOR', 'ADMIN'])
  role: string;
}
