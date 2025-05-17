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

  // 공통 로직 함수
  private async proxy(req: Request, res: Response) {
    const { method, headers, body } = req;
    const url = req.originalUrl;
    const baseUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    const target = `${baseUrl}${url}`;

    console.log('=== Gateway Proxy 요청 로그 ===');
    console.log('요청 URL:', url);               
    console.log('요청 메서드:', method);         
    console.log('프록시 대상:', target);         
    console.log('요청 헤더:', req.headers);      
    console.log('요청 바디:', req.body);         

    try {
      // headers가 내부에서 body parsing을 실패시킴
      const cleanedHeaders = { ...headers };
      delete cleanedHeaders['content-length'];
      delete cleanedHeaders['host'];

      const response = await this.http.axiosRef({
        method,
        url: target,
        headers: cleanedHeaders,
        ...(method !== 'GET' && method !== 'DELETE' ? { data: body } : {}),
      });

      console.log('응답 상태:', response.status);
      console.log('응답 바디:', response.data);


      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('프록시 실패:', error.message);
      return res.status(500).json({
        message: '프록시 요청 실패',
        error: error.message,
      });
    }
  }
}