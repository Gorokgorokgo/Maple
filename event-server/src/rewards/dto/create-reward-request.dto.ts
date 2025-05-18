import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { RewardDto } from "./reward.dto";
import { Type } from "class-transformer";

export class CreateRewardRequestDto {
  @ApiProperty({ example: 'evt_00001', description: '보상이 연결될 이벤트 코드' })
  @IsString()
  @IsNotEmpty()
  eventCode: string;

  @ApiProperty({ type: [RewardDto], description: '보상 목록' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardDto)
  rewards: RewardDto[];
}