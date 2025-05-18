import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const user = req.user;

    if (!user || !user.role) {
      throw new ForbiddenException('권한 정보가 없습니다.');
    }

    const role = user.role;

    // =========== 경로별 권한 검사 ===========

    // 보상 요청 : GET /rewards/logs
    if (
      method === 'GET' &&
      /^\/rewards\/logs(?:\?.*)?$/.test(req.originalUrl)
    ) if (!['OPERATOR', 'AUDITOR', 'ADMIN'].includes(role)) {
      throw new ForbiddenException('보상 요청은 운영자 또는 감사자 또는 관리자만 가능합니다.');
    }

    // 보상 요청 : GET /rewards/history
    if (method === 'GET' && /^\/rewards\/history(?:\?.*)?$/.test(req.originalUrl)
    ) if (!['AUDITOR', 'ADMIN'].includes(role)) {
      throw new ForbiddenException('지급 내역 조회는 감사자 또는 관리자만 가능합니다.');
    }

    // 보상 요청 : POST /events/:eventCode/rewards/request
    if (method === 'POST' && /^\/events\/[^/]+\/rewards\/request$/.test(originalUrl)) {
      if (!['USER', 'ADMIN'].includes(role)) {
        throw new ForbiddenException('보상 요청은 유저 또는 관리자만 가능합니다.');
      }
    }

    // 보상 정의 등록 : POST /rewards
    if (method === 'POST' && /^\/rewards\/define$/.test(originalUrl)) {
      if (!['OPERATOR', 'ADMIN'].includes(role)) {
        throw new ForbiddenException('보상 등록은 운영자 또는 관리자만 가능합니다.');
      }
    }

    // 이벤트 생성 : POST /events
    if (method === 'POST' && /^\/events$/.test(originalUrl)) {
      if (!['OPERATOR', 'ADMIN'].includes(role)) {
        throw new ForbiddenException('이벤트 생성은 운영자 또는 관리자만 가능합니다.');
      }
    }

    // 역할 변경 : PATCH /users/:id/role
    if (method === 'PATCH' && /^\/users\/[^/]+\/role$/.test(originalUrl)) {
      if (!['ADMIN'].includes(role)) {
        throw new ForbiddenException('역할 변경은 관리자만 가능합니다.');
      }
    }

    // 유저 조회 : GET /users/:loginId
    if (method === 'GET' && /^\/users\/[^/]+$/.test(originalUrl)) {
      if (!['ADMIN', 'OPERATOR'].includes(role)) {
        throw new ForbiddenException('유저 조회는 운영자 또는 관리자만 가능합니다.');
      }
    }

    // 권한 통과
    return true;
  }
}
