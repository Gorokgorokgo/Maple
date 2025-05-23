import { ApiProperty } from "@nestjs/swagger";

export class CreateEventResponseDto {
  @ApiProperty({ example: '664be84a7b6df038ff123abc' })
  eventId: string;

  @ApiProperty({ example: '이벤트가 성공적으로 생성되었습니다.' })
  message: string;

  @ApiProperty({ example: '2025-05-18T14:30:00.000Z', description: '(UTC 기준이며, 한국시간보다 9시간 이후 시각입니다.)'})
  createdAt: Date;
}
