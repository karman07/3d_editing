import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || '2979d8aba52839988a989a9a9532c47d7cf0174682e12d6ed54e289bb3d08b7a3d8f6a0881466af7e69285f93f534c92d2361301d46d903b73ac0637c772b0bc',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
