import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.publicKey,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, userName: payload.userName, userFullname: payload.userFullname, userPhonenumber: payload.userPhonenumber};
  }
}
