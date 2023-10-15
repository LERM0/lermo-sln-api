import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpStatus,
  UseInterceptors,
  Redirect,
  Res,
  HttpException,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { nanoid } from 'nanoid/non-secure';

import { SignInDTO } from '@common/validators';
import { AuthService } from '@services/auth/auth.service';
import { FacebookAuthGuard } from '@common/guards/facebook-auth.guard';
import { UserService } from '@services/user/user.service';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserProfileEntity } from '@entities/user.entity';

const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/signin')
  @ApiBody({ type: SignInDTO })
  async signin(@Body() body: SignInDTO): Promise<any> {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any): Promise<any> {
    const { user } = req;
    const { _id } = user;

    return user;
    try {
      const user = await this.userService.findById(_id)
      // const avatarUrl = await this.storageService.getPresignedUrl(user.avatar, 60 * 60 * 24)
      // const bannerUrl = await this.storageService.getPresignedUrl(user.banner, 60 * 60 * 24)
      const data = {
        ...user.toJSON(),
        // avatar: avatarUrl,
        // banner: bannerUrl
      }

      return new UserProfileEntity(data)
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Disable Facebook & Google in Beta
  @Get('/facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  @Redirect(WEB_URL, 301)
  async facebookLoginRedirect(@Req() req: any, @Res() res: any): Promise<any> {
    const {
      user: { user },
    } = req;
    const { email, firstName, lastName } = user;
    const result = await this.userService.findOne(email);

    if (!result) {
      const payload = {
        email,
        username: `${firstName} ${lastName}`,
        password: nanoid(),
      };
      await this.userService.create(payload);
    }

    const auth = await this.authService.ssoLogin(email);
    const { access_token } = auth;
    res.redirect(`${WEB_URL}/oauth/callback?token=${access_token}`);
  }

  // @Get('/google')
  // @UseGuards(GoogleAuthGuard)
  // async googleLogin() {
  //   return HttpStatus.OK;
  // }

  // @Get('/google/redirect')
  // @UseGuards(GoogleAuthGuard)
  // @Redirect(WEB_URL, 301)
  // async googleLoginRedirect(@Req() req: any, @Res() res: any): Promise<any> {
  //   const { user } = req;
  //   if (!user) throw 'Not user from google';

  //   const { email, firstName, lastName } = user;
  //   const result = await this.userService.findOne(email);

  //   if (!result) {
  //     const payload = {
  //       email,
  //       username: `${firstName} ${lastName}`,
  //       password: nanoid(),
  //     };
  //     await this.userService.create(payload);
  //   }

  //   const auth = await this.authService.login(email);
  //   const { access_token } = auth;
  //   res.redirect(`${WEB_URL}/oauth/callback?token=${access_token}`)
  // }
}
