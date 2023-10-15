import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const SALT_WORK_FACTOR = 10;
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);

    // return new Promise((resolve, reject) => {
    //   bcrypt.compare(pass, user.password, function(err, isMatch) {
    //     resolve(isMatch ? user : null);
    //   });
    // });

    return { _id: '1234', username: 'test', email: 'email' };
  }

  async hashPassword(password: string) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) reject(err);
    
        bcrypt.hash(password, salt, function(err, hash) {
          if (err) reject(err);

          resolve(hash)          
        });
      });
    })
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email ,password)
    if (!user) throw new UnauthorizedException()

    const { _id, username } = user;

    const payload = { _id, email, username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async ssoLogin(email: string) {
    const user = await this.userService.findOne(email);
    if (!user) throw new UnauthorizedException()

    const { _id, username } = user;

    const payload = { _id, email, username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
