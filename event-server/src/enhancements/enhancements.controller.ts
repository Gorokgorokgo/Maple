import {
  Controller,
  Post,
  Param,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnhancementsService } from './enhancements.service';
import { EnhancementResponseDto } from './dto/enhancement-response.dto';
import { Request } from 'express';

@ApiTags('enhancements')
@ApiBearerAuth('access-token')
@Controller('enhancements')
export class EnhancementsController {
  constructor(
    private readonly enhancementsService: EnhancementsService,
  ) {}

  @Post('attempt/:eventCode')
  @ApiOperation({ summary: '강화 시도 (10% 확률)' })
  @ApiResponse({ status: 200, type: EnhancementResponseDto })
  @ApiResponse({ status: 400, description: 'userCode 헤더 누락 or 잘못된 요청' })
  async attempt(
    @Param('eventCode') eventCode: string,
    @Req() req: Request,
  ): Promise<EnhancementResponseDto> {
    // Gateway 에서 자동 주입한 userCode 헤더 꺼내기
    const userCode =
      (req.headers['usercode'] as string) ||
      (req.headers['userCode'] as string);
    if (!userCode) {
      throw new BadRequestException('userCode 헤더가 없습니다.');
    }

    return this.enhancementsService.attemptEnhancement(
      userCode,
      eventCode,
    );
  }
}
