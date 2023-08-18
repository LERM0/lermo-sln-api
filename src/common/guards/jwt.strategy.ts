import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';

// const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const JWT_PRIVATE_KEY =  Buffer.from(process.env.JWT_PRIVATE_KEY, 'base64').toString('ascii')
const JWT_PUBLIC_KEY = Buffer.from(process.env.JWT_PUBLIC_KEY, 'base64').toString('ascii')
// const JWT_PRIVATE_KEY =  Buffer.from(process.env.JWT_PRIVATE_KEY, 'base64').toString('ascii')
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_PUBLIC_KEY,
      algorithms: ['RS256']
    });
  }

  async validate(payload: any) {
    const { email, username, _id } = payload
    return { email, username, _id };
  }
}
