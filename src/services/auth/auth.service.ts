import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser, IUserModel } from '@interfaces/user.interface';

@Injectable()
export class AuthService {
  private SALT_WORK_FACTOR: number;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.SALT_WORK_FACTOR = 10;
  }

  async validateUser(email: string, pass: string): Promise<IUserModel | null> {
    const user = await this.userService.findOne(email);

    if (!user) return null;

    return new Promise((resolve, reject) => {
      bcrypt.compare(pass, user.passwordHash, (err, isMatch) => {
        resolve(isMatch ? user : null);
      });
    });
  }

  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.SALT_WORK_FACTOR, function(err, salt) {
        if (err) reject(err);
    
        bcrypt.hash(password, salt, function(err, hash) {
          if (err) reject(err);

          resolve(hash)          
        });
      });
    })
  }

  async login(email: string, password: string, signOptions = {}) {
    const user = await this.validateUser(email ,password)
    if (!user) throw new UnauthorizedException()

    const { _id } = user;
    const payload = { _id, email, username: email };

    return {
      accessToken: this.jwtService.sign(payload, signOptions),
    };
  }

  /** @deprecated not implement soon */
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
