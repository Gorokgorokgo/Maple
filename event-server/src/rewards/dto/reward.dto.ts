import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { RewardItem } from "src/common/enums/rewardItem.enum";

export class RewardDto {
  @ApiProperty({ example: RewardItem.POINT, enum: RewardItem, description: '보상 타입' })
  @IsEnum(RewardItem)
  type: RewardItem;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: '1000' },
      { type: 'number', example: 1000 },
    ],
    description: '보상 값 (문자열 혹은 숫자)',
  })
  @IsNotEmpty()
  value: any;

  @ApiProperty({ example: 1, description: '보상 수량' })
  @IsNumber()
  amount: number;
}