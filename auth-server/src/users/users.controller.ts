import { Body, Controller, Get, NotFoundException, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UsersService } from './users.service';


@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    // 로그인 아이디 기반 유저 조회
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'OPERATOR')
    @Get(':loginId') 
    @ApiOperation({ summary: '유저 조회' })
    @ApiParam({ name: 'loginId', description: '유저의 로그인 ID' })
    @ApiResponse({ status: 200, description: '유저 정보 반환' })
    async getUserByLoginId(@Param('loginId') loginId: string) {
        const user = await this.usersService.findByLoginId(loginId);
        if (!user) {
            throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
        }

        const { password, ...safeUser } = user.toObject();
        return { user: safeUser };
    }

    // 역할 변경
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':loginId/role')
    @ApiOperation({ summary: '역할 변경' })
    updateUserRole(
        @Param('loginId') loginId: string,
        @Body() dto: UpdateUserRoleDto,
    ) {
        return this.usersService.updateRoleByLoginId(loginId, dto.role);
    }

    //---------- 테스트 메서드 -------------

    /*     @UseGuards(JwtAuthGuard)
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
        } */
}
