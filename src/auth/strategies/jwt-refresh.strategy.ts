import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true, 
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    
    if (!refreshToken) {
      throw new Error('Refresh token missing');
    }

    return {
      id: payload.sub,
      email: payload.email,
      refreshToken, 
    };
  }
}