import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsString } from 'class-validator';
import { EventStatus } from 'src/common/enums/event-status.enum';


export class CreateEventDto {
  @ApiProperty({ example: '친구 초대 이벤트' })
  @IsString()
  title: string;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-06-15T23:59:59.000Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: ['invite_3_friends', 'login_3_days'] })
  @IsArray()
  @IsString({ each: true })
  conditions: string[];

  @ApiProperty({ enum: EventStatus, example: EventStatus.ACTIVE })
  @IsEnum(EventStatus)
  status: EventStatus;
}