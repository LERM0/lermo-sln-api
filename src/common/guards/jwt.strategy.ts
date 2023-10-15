import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '@common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
      // secretOrKey: configService.get<string>('publicKey'),
      // algorithms: [configService.get<string>('algorithm')],
    });
  }

  async validate(payload: any) {
    const { email, username, _id } = payload
    return { email, username, _id };
  }
}
