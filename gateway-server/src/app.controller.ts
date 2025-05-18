import { HttpService } from '@nestjs/axios';
import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Controller()
export class AppController {
  constructor(private readonly http: HttpService,
    private readonly configService: ConfigService
  ) { }

  // ============ 인증, 권한 검사 X

  @All('auth/login')
  async loginRoute(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res);
  }

  @All('auth/register')
  async registerRoute(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res);
  }

  // ============ 인증, 권한 검사 O

  @UseGuards(JwtAuthGuard, RolesGuard)
  @All('auth/*path')
  async authRoutes(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @All('users/*path')
  async usersRoutes(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @All('events/*path')
  async eventsRoutes(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @All('events')
  async eventsdRoutes(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @All('rewards/*path')
  async rewardsRoutes(@Req() req: Request, @Res() res: Response) {
    return this.proxy(req, res);
  }

  // 공통 로직 함수
  private async proxy(req: Request, res: Response) {
    const { method, headers, body } = req;
    const url = req.originalUrl;

    // 요청 경로에 따라 다른 서버로 프록시
    let baseUrl: string;
    if (url.startsWith('/auth')) {
      baseUrl = this.configService.get<string>('AUTH_SERVICE_URL')!; // Auth -> auth
    } else if (url.startsWith('/users')) {
      baseUrl = this.configService.get<string>('AUTH_SERVICE_URL')!; // Auth -> users
    } else if (url.startsWith('/events')) {
      baseUrl = this.configService.get<string>('EVENT_SERVICE_URL')!; // Event -> events
    } else if (url.startsWith('/rewards')) {
      baseUrl = this.configService.get<string>('EVENT_SERVICE_URL')!; // Reward -> events
    } else {
      return res.status(404).json({ message: '작성 안한 프록시 루트' });
    }


    const target = `${baseUrl}${url}`;

    console.log('=== Gateway Proxy 요청 로그 ===');
    console.log('요청 URL:', url);
    console.log('요청 메서드:', method);
    console.log('프록시 대상:', target);
    console.log('요청 헤더:', req.headers);
    console.log('요청 바디:', req.body);


    // headers가 내부에서 body parsing을 실패시킴.
    const cleanedHeaders: Record<string, string> = {
      ...req.headers as any,
    };
    delete cleanedHeaders['host'];
    delete cleanedHeaders['content-length'];

    const user = (req as any).user;
    if (user) {
      cleanedHeaders['userId'] = user.sub || user.userId;   
      cleanedHeaders['userCode'] = user.userCode;            
    }

    console.log('axios 요청에 실제로 보낼 cleanedHeaders:', cleanedHeaders);
    try {
      const response = await this.http.axiosRef({
        method,
        url: target,
        headers: cleanedHeaders,
        ...(method !== 'GET' && method !== 'DELETE' ? { data: body } : {}),
      });

      console.log('=== Gateway Proxy 응답 로그 ===');
      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);
      console.log('응답 바디:', response.data);

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: '프록시 요청 실패' };
      console.error('프록시 실패:', error.message);
      return res
        .status(status)
        .json(data);
    }
  }
}