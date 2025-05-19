import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsString } from 'class-validator';
import { EventStatus } from 'src/common/enums/event-status.enum';


export class CreateEventRequestDto {
  @ApiProperty({ example: '무기_강화_이벤트' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-06-15T23:59:59.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)' })
  @IsDateString()
  endDate: string;

  // '조건', '여러개', '추가', '가능'
  @ApiProperty({ example: ['무기강화_3번_성공'] })
  @IsArray()
  @IsString({ each: true })
  conditions: string[];

  @ApiProperty({ enum: EventStatus, example: EventStatus.ACTIVE })
  @IsEnum(EventStatus)
  status: EventStatus;
}