import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    if (request.body?.refreshToken) {
      request.headers.authorization = `Bearer ${request.body.refreshToken}`;
    }

    return request;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Недействительный refresh-токен');
    }
    return user;
  }
}