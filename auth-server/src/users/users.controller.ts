import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        return {
            message: '테스트 인증 성공!',
            user: req.user,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    @Get('user-only')
    // 유저 테스트
    getUserData(@Req() req) {
        return {
            message: '유저 전용 데이터입니다.',
            user: req.user,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OPERATOR')
    @Get('operator-only')
    // 감사자 테스트
    getoperatorData(@Req() req) {
        return {
            message: '운영자 전용 데이터입니다.',
            user: req.user,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('AUDITOR')
    @Get('auditor-only')
    // 감사자 테스트
    getAuditorData(@Req() req) {
        return {
            message: '감사자 전용 데이터입니다.',
            user: req.user,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('admin-only')
    // 관리자 테스트
    getAdminData(@Req() req) {
        return {
            message: '관리자 전용 데이터입니다.',
            user: req.user,
        };
    }
}
